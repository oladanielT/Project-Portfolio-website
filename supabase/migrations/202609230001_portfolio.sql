-- Run once in the Supabase SQL editor, or use `supabase db push`.
create table public.portfolio_admins (user_id uuid primary key references auth.users(id) on delete cascade);
alter table public.portfolio_admins enable row level security;
revoke all on public.portfolio_admins from anon, authenticated;
grant select on public.portfolio_admins to authenticated;
create policy "Read own admin membership" on public.portfolio_admins for select to authenticated using (user_id = auth.uid());
create function public.portfolio_is_admin() returns boolean language sql stable security definer set search_path = '' as $$
 select exists(select 1 from public.portfolio_admins where user_id = auth.uid());
$$;
revoke all on function public.portfolio_is_admin() from public;
grant execute on function public.portfolio_is_admin() to authenticated;
create table public.portfolio_publications (id integer primary key check(id=1), content jsonb not null, updated_at timestamptz not null default now());
create table public.portfolio_drafts (id integer primary key check(id=1), content jsonb not null, version integer not null default 1, updated_at timestamptz not null default now());
create table public.portfolio_revisions (id bigint generated always as identity primary key, content jsonb not null, created_at timestamptz not null default now(), created_by uuid references auth.users(id) on delete set null);
create table public.portfolio_media (id uuid primary key, path text not null unique, name text not null, mime text not null, size integer not null, created_at timestamptz not null default now());
create table public.portfolio_inquiries (id uuid primary key default gen_random_uuid(), name text not null, email text not null, message text not null, status text not null default 'new' check(status in ('new','contacted','archived')), created_at timestamptz not null default now());
create table public.portfolio_rate_limits (key text primary key, window_start timestamptz not null default now(), count integer not null default 1);
alter table public.portfolio_publications enable row level security;
alter table public.portfolio_drafts enable row level security;
alter table public.portfolio_revisions enable row level security;
alter table public.portfolio_media enable row level security;
alter table public.portfolio_inquiries enable row level security;
alter table public.portfolio_rate_limits enable row level security;
revoke all on public.portfolio_publications, public.portfolio_drafts, public.portfolio_revisions, public.portfolio_media, public.portfolio_inquiries, public.portfolio_rate_limits from anon, authenticated;
grant select on public.portfolio_publications to anon, authenticated;
grant select on public.portfolio_drafts, public.portfolio_revisions, public.portfolio_media, public.portfolio_inquiries to authenticated;
grant insert, delete on public.portfolio_media to authenticated;
grant update(status) on public.portfolio_inquiries to authenticated;
create policy "Published content is public" on public.portfolio_publications for select to anon,authenticated using(true);
create policy "Admins read drafts" on public.portfolio_drafts for select to authenticated using(public.portfolio_is_admin());
create policy "Admins read revisions" on public.portfolio_revisions for select to authenticated using(public.portfolio_is_admin());
create policy "Admins read media" on public.portfolio_media for select to authenticated using(public.portfolio_is_admin());
create policy "Admins insert media" on public.portfolio_media for insert to authenticated with check(public.portfolio_is_admin());
create policy "Admins remove media metadata" on public.portfolio_media for delete to authenticated using(public.portfolio_is_admin());
create policy "Admins read inquiries" on public.portfolio_inquiries for select to authenticated using(public.portfolio_is_admin());
create policy "Admins update inquiry status" on public.portfolio_inquiries for update to authenticated using(public.portfolio_is_admin()) with check(public.portfolio_is_admin());
-- Expected versions prevent a second browser tab from silently overwriting edits.
create function public.portfolio_save_draft(payload jsonb, expected_version integer) returns integer language plpgsql security definer set search_path = '' as $$
declare current_version integer; next_version integer;
begin
 if not public.portfolio_is_admin() then raise exception 'Forbidden' using errcode='42501'; end if;
 perform pg_advisory_xact_lock(8129301);
 select version into current_version from public.portfolio_drafts where id=1 for update;
 if coalesce(current_version,0) <> expected_version then raise exception 'Draft changed in another session. Reload before saving.' using errcode='40001'; end if;
 next_version := coalesce(current_version,0)+1;
 insert into public.portfolio_drafts(id,content,version) values(1,payload,next_version) on conflict(id) do update set content=excluded.content,version=excluded.version,updated_at=now();
 return next_version;
end; $$;
create function public.portfolio_publish(expected_version integer) returns bigint language plpgsql security definer set search_path = '' as $$
declare draft public.portfolio_drafts; revision_id bigint;
begin
 if not public.portfolio_is_admin() then raise exception 'Forbidden' using errcode='42501'; end if;
 perform pg_advisory_xact_lock(8129301);
 select * into draft from public.portfolio_drafts where id=1 for update;
 if draft.id is null or draft.version <> expected_version then raise exception 'Draft changed. Save and review it before publishing.' using errcode='40001'; end if;
 insert into public.portfolio_revisions(content,created_by) values(draft.content,auth.uid()) returning id into revision_id;
 insert into public.portfolio_publications(id,content) values(1,draft.content) on conflict(id) do update set content=excluded.content,updated_at=now();
 return revision_id;
end; $$;
revoke all on function public.portfolio_save_draft(jsonb,integer), public.portfolio_publish(integer) from public;
grant execute on function public.portfolio_save_draft(jsonb,integer), public.portfolio_publish(integer) to authenticated;
-- Private originals: /api/media/[id] checks publication or admin access before signing.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values ('portfolio-media','portfolio-media',false,8388608,array['image/jpeg','image/png','image/webp','application/pdf']) on conflict(id) do nothing;
create policy "Portfolio admin media read" on storage.objects for select to authenticated using(bucket_id='portfolio-media' and public.portfolio_is_admin());
create policy "Portfolio admin media upload" on storage.objects for insert to authenticated with check(bucket_id='portfolio-media' and public.portfolio_is_admin());
create policy "Portfolio admin media cleanup" on storage.objects for delete to authenticated using(bucket_id='portfolio-media' and public.portfolio_is_admin());
-- Return a path only when the exact local media URL occurs in a published JSON string.
create function public.portfolio_published_media(media_id uuid) returns text language sql stable security definer set search_path = '' as $$
 select m.path from public.portfolio_media m where m.id=media_id and exists(
 select 1 from public.portfolio_publications p where jsonb_path_exists(p.content,'$.** ? (@ == $url)',jsonb_build_object('url','/api/media/' || media_id::text)));
$$;
revoke all on function public.portfolio_published_media(uuid) from public;
grant execute on function public.portfolio_published_media(uuid) to anon,authenticated;
-- Signing an approved public media path requires a server-only service key.
-- Contact writes are also server-only: direct anonymous API writes are prohibited.
create function public.portfolio_submit_inquiry(visitor_key text, visitor_name text, visitor_email text, visitor_message text) returns void language plpgsql security definer set search_path = '' as $$
declare hits integer;
begin
 if length(visitor_name)>120 or length(visitor_name)<1 or length(visitor_email)>254 or length(visitor_message)>5000 or length(visitor_message)<10 then raise exception 'Invalid inquiry'; end if;
 insert into public.portfolio_rate_limits(key) values(visitor_key)
 on conflict(key) do update set count=case when public.portfolio_rate_limits.window_start < now()-interval '1 hour' then 1 else public.portfolio_rate_limits.count+1 end,
 window_start=case when public.portfolio_rate_limits.window_start < now()-interval '1 hour' then now() else public.portfolio_rate_limits.window_start end returning count into hits;
 if hits>5 then raise exception 'Too many messages. Please try again later.' using errcode='P0001'; end if;
 insert into public.portfolio_inquiries(name,email,message) values(visitor_name,visitor_email,visitor_message);
 delete from public.portfolio_rate_limits where window_start < now()-interval '2 days';
end; $$;
revoke all on function public.portfolio_submit_inquiry(text,text,text,text) from public,anon,authenticated;
grant execute on function public.portfolio_submit_inquiry(text,text,text,text) to service_role;
