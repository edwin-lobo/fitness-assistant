# Supabase Auth Setup

Fitness Assistant uses Supabase Auth for login and a `profiles` table for application roles.

## Roles

The application role enum is:

- `provider`: public signup, publishable profile.
- `client`: public signup, publishable profile.
- `admin`: managed role, invite-only.
- `mod`: managed role, invite-only.

The public signup form only sends `provider` or `client` through `public_signup_role` user metadata. The database trigger ignores any other signup value and falls back to `client`.

## Local Environment

Copy `.env.example` to `.env.local` and fill in:

```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

These are browser-safe Supabase client values. Do not put service-role keys in Vite environment variables.

## Database Migration

Run the SQL in `supabase/migrations/202605160001_auth_profiles.sql` against your Supabase project.

The migration creates:

- `public.app_role`
- `public.profiles`
- `public.public_profiles`
- a new-user trigger that creates a profile from Supabase Auth metadata
- RLS policies for own-profile access and public provider/client profile reads

## Local Supabase CI

The repository includes a GitHub Actions job that starts a local Supabase database from the committed migrations. This keeps pull-request checks off the hosted free-tier project.

The CI job:

- starts the local database with `supabase db start`
- regenerates `src/lib/database.types.ts`
- fails if the committed types drift from the local schema
- runs pgTAP database tests from `supabase/tests/database`

To run the same checks locally, install the Supabase CLI and Docker, then run:

```bash
supabase db start
supabase gen types typescript --local --schema public > src/lib/database.types.ts
supabase test db
```

If you use Podman on macOS, start the Podman machine before running Supabase CLI commands:

```bash
podman machine start
DOCKER_HOST=unix:///var/run/docker.sock supabase db start
```

If the CLI still reports that it cannot connect to Docker, verify that the Podman machine stayed running with:

```bash
podman machine list
podman info
```

## Managed Role Promotion

Promote `admin` and `mod` from the Supabase dashboard, SQL editor, or a future admin console using a trusted server-side context. Do not expose service-role credentials to the React app.

Example SQL for a verified user:

```sql
-- Run from a trusted admin context only, never from the browser app.
update public.profiles
set role = 'admin'
where id = '00000000-0000-0000-0000-000000000000';
```

## GCP Deployment Notes

The current app can remain a static Vite build on Google Cloud Storage, Firebase Hosting, or Cloud Run static hosting. Add the same `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` values to the build environment used by that deployment.
