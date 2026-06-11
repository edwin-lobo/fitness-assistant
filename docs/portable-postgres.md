# Portable Postgres Test Harness

Fitness Assistant keeps a plain Postgres test path as a backup to hosted Supabase. This validates relational schema behavior before pushing migrations to Supabase and keeps the project portable if relational data moves later.

## What It Runs

The portable database test runner:

1. starts `postgres:15-alpine` with Docker Compose or Podman-backed Docker Compose
2. applies `database/bootstrap/000_supabase_compat.sql`
3. applies all SQL files in `supabase/migrations`
4. runs all SQL files in `database/tests`

The bootstrap creates only the local Supabase compatibility surface required by current migrations:

- `auth.users`
- `auth.uid()`
- `anon`
- `authenticated`

It does not replace Supabase Auth or the hosted Supabase REST API.

## Commands

```bash
npm run db:local:start
npm run db:test
npm run db:local:reset
npm run db:local:stop
```

Runner unit tests:

```bash
npm run test:portable-db
```

## Podman Notes

This project uses Docker-compatible commands so Podman can back the workflow.

```bash
podman machine start
npm run db:test
```

If Docker-compatible clients do not find the Podman socket, point them at Podman's forwarded socket:

```bash
DOCKER_HOST=unix:///var/run/docker.sock npm run db:test
```

The runner uses `docker` when it is installed and falls back to `podman` when it is not. You can force a specific CLI with:

```bash
PORTABLE_DB_CONTAINER_CLI=podman npm run db:test
```

## Port

The local Postgres port defaults to `55432`.

Override it with:

```bash
PORTABLE_DB_PORT=55433 npm run db:test
```

## CI

CI runs the portable database tests in a separate `portable-postgres` job. The Supabase-local job remains as compatibility coverage for generated types and Supabase CLI behavior.
