# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static React + TypeScript + Vite single-page app for fitness and household nutrition planning. The site has **no application backend** — it builds to static assets in `dist/` and deploys to GitHub Pages. The only server-side dependency is Supabase (hosted), used purely for auth and a `profiles` table; the app runs fully without it (`isSupabaseConfigured` gates all Supabase usage).

The current product focus is the **nutrition MVP**: a household-first weekly meal planner that turns repeatable meal templates into a consolidated grocery checklist and shareable text output.

## Commands

```bash
npm run dev            # Vite dev server
npm run build          # production build to dist/ (used by CI and Pages)
npm run preview        # serve the built app (Playwright drives this)
npm run lint           # eslint, zero-warning gate

npm run test           # unit + e2e
npm run test:unit      # node --test over scripts/*.test.mjs and tests/unit/*.test.mjs
npm run test:e2e       # Playwright (auto-starts `npm run preview` on :4173)
npm run test:e2e:ui    # Playwright UI mode
```

Run a single unit test file: `node --test tests/unit/nutrition.test.mjs`
Run a single e2e spec: `npx playwright test tests/e2e/nutrition-planner.spec.ts`

First-time Playwright setup: `npx playwright install chromium`

For Supabase-backed auth locally, copy `.env.example` to `.env.local` and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. The app runs without these.

### Database test harnesses

There are **two independent DB test paths**, mirrored by the two non-`verify` CI jobs:

```bash
# Portable Postgres (Docker/Podman) — relational portability check
npm run db:local:start   # start container from docker-compose.db.yml
npm run db:test          # apply bootstrap + migrations + database/tests/*.sql
npm run db:local:reset
npm run db:local:stop
npm run test:portable-db # unit tests for the runner script itself

# Hosted Supabase smoke check (needs SUPABASE_URL / SUPABASE_ANON_KEY env)
npm run supabase:activity-check
npm run test:activity-check
```

The portable harness (`scripts/portable-db.mjs`) applies SQL in order: `database/bootstrap/` (Supabase-compat shims so plain Postgres can run Supabase migrations) → `supabase/migrations/` → `database/tests/`. It auto-detects `docker` vs `podman`; override with `PORTABLE_DB_CONTAINER_CLI` and `PORTABLE_DB_PORT`.

## Architecture

### Domain logic lives in `src/data/nutrition.ts`
This is the heart of the app and the single source of truth for the nutrition feature. It is **pure data + pure functions** — no React, no I/O — which is why it can be unit-tested with `node --test`. It contains:
- Type definitions (`MealTemplate`, `DayPlan`, `GrocerySection`, `HouseholdProfile`, etc.)
- Seed data: `mealTemplates`, `weekTemplates` (balanced/batch-cook/low-decision), `defaultHousehold`
- Builders consumed by the UI: `buildGroceryChecklist` (consolidates duplicate ingredients by `category:item:unit`), `buildShareOutput` / `buildGroceryAppOutput` / `buildMealTemplateOutput` (share formats), `buildRepeatMealPlan`, `buildLowerProcessedPlan`, `getLowerProcessedMealPercent`, `getProcessedSwapTips`

When adding nutrition behavior, add the pure function here with a `tests/unit` test, then wire it into the component. Don't put planning/grocery logic inside components.

### Components in `src/components/` are presentational sections
`App.tsx` composes the page as a fixed sequence of sections (Header → Hero → FeatureGrid → PlanSection → NutritionPlanner → GoalTracker → AuthSection → CTASection → Footer). Most sections render hardcoded marketing content passed as props from `App.tsx`. `NutritionPlanner.tsx` is the only stateful feature component; it holds the editable plan/household state and calls the `nutrition.ts` builders.

### Supabase integration (`src/lib/`)
- `supabase.ts` creates the client only when both `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set; otherwise `supabase` is `null` and the UI degrades gracefully. Always guard usage on `isSupabaseConfigured`.
- `database.types.ts` is **generated**, not hand-edited. CI fails if it drifts from the schema. Regenerate after any migration:
  ```bash
  supabase db start
  supabase gen types typescript --local --schema public > src/lib/database.types.ts
  ```
- Roles (`app_role` enum): `provider` and `client` are public signup roles; `admin` and `mod` are invite-only / server-assigned.

### Infrastructure (`infra/terraform/`)
An Azure-native Terraform stack that replaces the hosted Supabase dependency (per the homelab spec — fitness-assistant is the Azure project, Databricks its key service). It provisions PostgreSQL Flexible Server (the `profiles` DB), Azure AD B2C (auth), Key Vault (secrets), and a Databricks workspace. It's **backend infra only** — the frontend stays on GitHub Pages, and the app code (`src/lib/`) still uses `@supabase/supabase-js`; rewiring it to the Azure SDKs is a documented follow-up. Conventions match `../ridge-to-coast/infra/terraform/`. See `infra/terraform/README.md` for the Supabase→Azure mapping and apply steps.

### Deployment base path
`vite.config.ts` reads `VITE_BASE_PATH`. The Pages workflow sets it to `/<repo-name>/` so assets resolve under `https://<owner>.github.io/<repo-name>/`. Local dev/preview default to `/`. Don't hardcode absolute asset paths.

## CI gates (must pass before merge)
`.github/workflows/ci.yml` runs three jobs on every PR: **portable-postgres** (`test:portable-db` + `db:test`), **supabase** (regenerates and diffs `database.types.ts`, runs `supabase test db`), and **verify** (lint → build → unit → e2e). Match these locally before pushing.

## Reference docs
`docs/nutrition-mvp-spec.md` (scope/success metrics), `docs/nutrition-data-model.md`, `docs/nutrition-workflow.md`, `docs/supabase-auth.md` (role schema + RLS), `docs/portable-postgres.md`, `docs/testing.md`, `docs/backlog/nutrition-mvp-backlog.md`.
