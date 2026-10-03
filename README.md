# Oluwapelumi's portfolio & studio

Next.js App Router, TypeScript, an deep burgundy, wine, and ivory interface with rose accents, GSAP motion, and a Supabase-backed content studio at `/admin`.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. Without Supabase configuration, the complete public portfolio uses `content/site.json`; `/admin` explains the setup. No demo login or insecure editing bypass is included. Case studies are at `/work/[slug]`.

## Connect Supabase

1. Create a Supabase project you own. Save its database password securely.
2. Open its SQL Editor and execute `supabase/migrations/202609230001_portfolio.sql` **once**. This creates drafts, publications, revisions, administrator membership, media, inquiries, rate limiting, RPCs, permissions, and a private storage bucket. With the Supabase CLI you may instead link the project and run `supabase db push`.
3. Copy `.env.example` to `.env.local`. Set the project URL, publishable key, and **server-only legacy `service_role` key** from the project's API settings. Never prefix the service key with `NEXT_PUBLIC`, commit it, or paste it into browser code. The key is needed to serve published private uploads and accept inquiries. Without it, existing external images work but uploaded public media and inquiries do not.
4. Set `SITE_URL=http://localhost:3000` locally. In production, set it to your canonical HTTPS origin. This is used for same-origin write validation.
5. In Supabase Authentication → Users, create the owner's email/password account. Confirm the email when creating the account. Disable public account signup for this invitation-only studio. Additional users do **not** gain editing access merely by signing in.
6. Copy that user's UUID, then run this SQL with the real UUID:

```sql
insert into public.portfolio_admins(user_id)
values ('REPLACE-WITH-AUTH-USER-UUID');
```

7. Restart Next.js, open `/admin`, and sign in. Select **Save draft** to import the supplied content, open **Preview**, then **Publish** to create the first database publication.

For an owner password reset before first handover, use Supabase's user administration facilities. The studio currently supports email/password login and sign-out, not an in-app password-reset flow. Configure custom SMTP and redirect URLs in Supabase before adding email recovery or invitations through your app.

## Client editing workflow

- Edit Introduction, Your story, Selected work, Expertise, Organizations, Toolkit, Testimonial, Contact, or SEO.
- Image fields accept existing HTTPS links or uploads (JPG, PNG, WebP, PDF for a CV; max 8 MB). Media library URLs can be copied into other fields. Original files are private. Only files referenced in the published JSON are publicly served; authenticated admins can preview draft files.
- Reorder projects, paragraphs, case-study blocks, organizations, expertise, process steps, and tools with arrow buttons. One project can be featured.
- **Save draft** does not affect the live site. **Preview** opens the saved homepage draft. Its project links open authenticated draft case studies, including unpublished projects.
- **Publish** atomically records a revision and replaces the publication, then revalidates public-page caches. On unexpected cache invalidation failure, retry publication or allow the five-minute cache interval to expire.
- **Publishing history → Restore as draft** restores an earlier publication without immediately changing the live site.
- Concurrent editing tabs are protected by a version check. If a conflict occurs, preserve your unsaved text elsewhere and reload before applying it again.
- The process section contains proposed wording and starts hidden. Tools start empty and hidden. Confirm real tools and process wording before enabling these sections. Organization names are drawn from the supplied projects; no partner logos or endorsements have been invented.
- Enable the contact form in Contact & links if desired. Messages are stored under Inquiries, where their status can be changed. Replies open the owner's email client. Automatic email notifications are not configured.

## Data and permissions

`portfolio_publications` contains the single public snapshot. `portfolio_drafts` contains the editable snapshot and optimistic-lock version. `portfolio_revisions` retains published snapshots. Snapshot storage makes publication/restoration atomic across all sections, avoiding mixed old/new content. Structured JSON is validated with Zod before save/publish.

Only an authenticated user present in `portfolio_admins` may manage drafts, media, revisions, or inquiries. Public users can read the published snapshot and request published media; they cannot list media or query inquiries. All content mutation routes verify both origin and administrator membership; database policies and security-definer RPCs repeat membership enforcement. The service-role key is never used for content administration.

`/api/media/[id]` checks whether the exact media URL occurs in published JSON or whether the caller is an administrator, then issues a short-lived signed storage redirect. Removing a file reference on publication removes public access through this route; an already issued signed link can remain valid for up to 60 seconds. Media referenced in hidden sections is still part of the published snapshot and is therefore public—remove the reference to make the asset private. Uploaded SVG/HTML is not accepted. Unused originals are retained so historical versions keep working.

The inquiry endpoint validates input, uses a honeypot and a database-enforced five-per-hour rate limit. On Vercel it uses the platform-provided `x-vercel-forwarded-for` header. Other hosts must overwrite `x-real-ip` at a trusted reverse proxy; with no trusted header, requests share one rate bucket. Raw IP addresses are not stored. Review retention/export requirements for messages before client handover.

The original Decap/Keystatic routes and dependencies are retired in favor of the studio. `content/site.json` remains the initial seed and disconnected fallback, not a second live editor.

## Verify

```bash
npm run build
npm run test:e2e
npm run test:db
```

Browser tests run an isolated production build on port 4317, with a temporary presentation-only editor fixture and mocked editing responses. The fixture is removed after compilation and is never part of the regular production build. They cover editor save/publish/conflict interactions, public navigation, project details, responsive overflow, reduced motion, the disconnected admin setup, and protected endpoints. They require no Supabase credentials and deliberately clear connection variables. Database tests execute the actual migration in PGlite, modeling Supabase-owned auth/storage schemas and testing RLS, publication, version checks, private media, and rate limits. These do not replace verification against a connected Supabase project. Playwright uses installed Google Chrome by default; set `PLAYWRIGHT_CHROMIUM_EXECUTABLE` to another Chromium binary, or install Playwright Chromium and set up the config accordingly.

For a connected project, complete this acceptance checklist before launch:

1. Verify an unlisted authenticated user cannot access drafts/media/inquiries or execute save/publish RPCs.
2. Save a draft, confirm public content remains unchanged, and inspect the authenticated preview.
3. Upload an image; confirm its URL is inaccessible when signed out until published.
4. Publish; confirm the homepage and project page show the same version.
5. Edit from two tabs; confirm the older version receives a conflict.
6. Restore a historical publication into a draft, preview, then republish.
7. Enable inquiries, submit a real message, update its status, and confirm public database access remains denied.
8. Verify keyboard navigation, reduced motion, small screens, image crops, all links, and content accuracy with the owner.

## Deploy

Deploy the Next.js app to your chosen Node-compatible host. Configure the same environment variables with the production `SITE_URL`, run the migration on the production Supabase project, and grant owner membership. Use the intended domain in Supabase authentication settings. Test the connected acceptance checklist above. Plan database/storage backups in the Supabase account before handover; publication history is not a database backup.

There are no Supabase credentials or a provisioned cloud project in this repository. Live auth, database permissions, and storage integration must be verified after connecting your project.
