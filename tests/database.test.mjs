import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";

const admin = "11111111-1111-4111-8111-111111111111";
const outsider = "22222222-2222-4222-8222-222222222222";
const media = "33333333-3333-4333-8333-333333333333";
const mediaUrl = `/api/media/${media}`;

async function fixture() {
  const db = new PGlite();
  // Model Supabase's platform-owned roles, auth.uid(), and storage tables. The application migration is unmodified.
  await db.exec(`create role anon; create role authenticated; create role service_role;
 create schema auth; create table auth.users(id uuid primary key);
 create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
 grant usage on schema auth to anon,authenticated,service_role;
 grant execute on function auth.uid() to anon,authenticated,service_role;
 create schema storage;
 create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);
 create table storage.objects(id uuid default gen_random_uuid(),bucket_id text,name text);
 alter table storage.objects enable row level security;
 grant usage on schema storage to authenticated;
 grant select,insert,delete on storage.objects to authenticated;`);
  await db.exec(
    await readFile(
      new URL(
        "../supabase/migrations/202609230001_portfolio.sql",
        import.meta.url,
      ),
      "utf8",
    ),
  );
  await db.query("insert into auth.users(id) values($1),($2)", [
    admin,
    outsider,
  ]);
  await db.query("insert into portfolio_admins(user_id) values($1)", [admin]);
  return db;
}
async function role(db, name, id = "") {
  await db.exec("reset role");
  await db.query("select set_config('request.jwt.claim.sub',$1,false)", [id]);
  await db.exec(`set role ${name}`);
}

test("migration enforces draft isolation, atomic publication, version conflicts, and restoration", async () => {
  const db = await fixture();
  try {
    await role(db, "anon");
    await assert.rejects(
      db.query("select * from portfolio_drafts"),
      /permission denied/,
    );
    await assert.rejects(
      db.query("select portfolio_save_draft('{}',0)"),
      /permission denied/,
    );
    await role(db, "authenticated", outsider);
    assert.equal(
      (await db.query("select * from portfolio_drafts")).rows.length,
      0,
    );
    await assert.rejects(
      db.query("select portfolio_save_draft('{}',0)"),
      /Forbidden/,
    );
    await assert.rejects(
      db.query(`insert into portfolio_admins values('${outsider}')`),
      /permission denied/,
    );
    await role(db, "authenticated", admin);
    assert.equal(
      (
        await db.query("select portfolio_save_draft($1,0) as version", [
          JSON.stringify({ title: "First" }),
        ])
      ).rows[0].version,
      1,
    );
    assert.equal(
      (await db.query("select * from portfolio_publications")).rows.length,
      0,
    );
    await assert.rejects(
      db.query("select portfolio_save_draft('{}',0)"),
      /another session/,
    );
    await db.query("select portfolio_publish(1)");
    await db.query("select portfolio_save_draft($1,1)", [
      JSON.stringify({ title: "Second" }),
    ]);
    await assert.rejects(
      db.query("select portfolio_publish(1)"),
      /Draft changed/,
    );
    await role(db, "anon");
    assert.equal(
      (await db.query("select content from portfolio_publications")).rows[0]
        .content.title,
      "First",
    );
    await role(db, "authenticated", admin);
    await db.query("select portfolio_publish(2)");
    const historical = (
      await db.query(
        "select content from portfolio_revisions order by id limit 1",
      )
    ).rows[0].content;
    await db.query("select portfolio_save_draft($1,2)", [
      JSON.stringify(historical),
    ]);
    assert.equal(
      (await db.query("select content from portfolio_publications")).rows[0]
        .content.title,
      "Second",
    );
    await db.query("select portfolio_publish(3)");
    assert.equal(
      (await db.query("select content from portfolio_publications")).rows[0]
        .content.title,
      "First",
    );
    assert.equal(
      (await db.query("select * from portfolio_revisions")).rows.length,
      3,
    );
  } finally {
    await db.close();
  }
});

test("private media is readable only by admins or through an exact published reference", async () => {
  const db = await fixture();
  try {
    await role(db, "authenticated", outsider);
    await assert.rejects(
      db.query(
        "insert into storage.objects(bucket_id,name) values('portfolio-media','bad.jpg')",
      ),
      /row-level security/,
    );
    await role(db, "authenticated", admin);
    await db.query(
      "insert into portfolio_media(id,path,name,mime,size) values($1,$2,$3,$4,10)",
      [media, `${media}.jpg`, "photo.jpg", "image/jpeg"],
    );
    await db.query(
      "insert into storage.objects(bucket_id,name) values('portfolio-media',$1)",
      [`${media}.jpg`],
    );
    await db.query("select portfolio_save_draft($1,0)", [
      JSON.stringify({ hero: { photo: mediaUrl } }),
    ]);
    await role(db, "anon");
    assert.equal(
      (await db.query("select portfolio_published_media($1) as path", [media]))
        .rows[0].path,
      null,
    );
    await assert.rejects(
      db.query("select * from portfolio_media"),
      /permission denied/,
    );
    await role(db, "authenticated", admin);
    await db.query("select portfolio_publish(1)");
    await role(db, "anon");
    assert.equal(
      (await db.query("select portfolio_published_media($1) as path", [media]))
        .rows[0].path,
      `${media}.jpg`,
    );
    await role(db, "authenticated", admin);
    await db.query("select portfolio_save_draft($1,1)", [
      JSON.stringify({
        body: `Mentioning ${mediaUrl} in a sentence does not publish it`,
      }),
    ]);
    await db.query("select portfolio_publish(2)");
    await role(db, "anon");
    assert.equal(
      (await db.query("select portfolio_published_media($1) as path", [media]))
        .rows[0].path,
      null,
    );
    await role(db, "authenticated", outsider);
    assert.equal(
      (await db.query("select * from storage.objects")).rows.length,
      0,
    );
  } finally {
    await db.close();
  }
});

test("inquiries require the server role, remain private, and are rate limited", async () => {
  const db = await fixture();
  try {
    await role(db, "anon");
    await assert.rejects(
      db.query(
        "select portfolio_submit_inquiry('visitor','A','a@example.com','A real message here')",
      ),
      /permission denied/,
    );
    await role(db, "service_role");
    for (let i = 0; i < 5; i++)
      await db.query(
        "select portfolio_submit_inquiry('visitor','A','a@example.com','A real message here')",
      );
    await assert.rejects(
      db.query(
        "select portfolio_submit_inquiry('visitor','A','a@example.com','A real message here')",
      ),
      /Too many messages/,
    );
    await role(db, "authenticated", outsider);
    assert.equal(
      (await db.query("select * from portfolio_inquiries")).rows.length,
      0,
    );
    await role(db, "authenticated", admin);
    assert.equal(
      (await db.query("select * from portfolio_inquiries")).rows.length,
      5,
    );
    await db.query("update portfolio_inquiries set status='contacted'");
    await assert.rejects(
      db.query("update portfolio_inquiries set email='altered@example.com'"),
      /permission denied/,
    );
    await role(db, "anon");
    await assert.rejects(
      db.query("select * from portfolio_inquiries"),
      /permission denied/,
    );
  } finally {
    await db.close();
  }
});
