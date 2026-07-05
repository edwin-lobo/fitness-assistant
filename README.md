# Fitness Assistant

Fitness Assistant is a static React, TypeScript, and Vite app for planning workouts and household nutrition routines. The current MVP focuses on a low-friction nutrition planner that turns a repeatable weekly meal plan into a grocery checklist.

## Current Status

- Live site: https://edwin-lobo.github.io/fitness-assistant/
- Merged MVP foundation: issues `#1` through `#4`
- Open review: PR `#17` implements issues `#5` through `#8`
- Next backlog batch after PR `#17`: issues `#9` through `#12`
- Deployment target: GitHub Pages

## Local development

```bash
npm install
npm run dev
```

If your environment restricts access to the npm registry, configure the registry that works for you before running `npm install`.

For Supabase-backed login, copy `.env.example` to `.env.local` and fill in `VITE_SUPABASE_URL` and
`VITE_SUPABASE_ANON_KEY`. See `docs/supabase-auth.md` for the role schema and RLS setup.

## Scripts

```bash
npm run build
npm run lint
npm run preview
npm run test:e2e
```

`npm run build` emits the production assets to `dist/`.

## Nutrition MVP

The nutrition feature is a household-first planner for lower-friction weekly planning and fewer processed foods. It is intentionally simple: users edit household member preferences, choose meals from repeatable templates, review a generated grocery checklist, and share the result through copy, email, or text.

Implemented across the nutrition MVP branch:

- Editable household member profiles.
- Low-choice weekly meal planning.
- Repeatable meal templates.
- Grocery checklist generation with duplicate consolidation.
- Reusable week templates for balanced, batch-cook, and low-decision planning.
- Low-friction one-click repeat and lower-processed swap actions.
- Copy, email, and text output for manual grocery-app handoff.
- Share formats for full plans, grocery-only handoff, and reusable meal templates.
- Processed-food reduction guidance tied to planned meals.
- Playwright browser coverage for the main nutrition workflow.

## Authentication

Supabase Auth powers login and signup. Public signup supports `provider` and `client` accounts. `admin` and `mod`
roles are invite-only and should be assigned by existing admins or trusted server-side tooling.

## Infrastructure

`infra/terraform/` provisions an Azure-native stack that replaces the hosted Supabase dependency, aligned with the
homelab spec (fitness-assistant is the Azure project; Databricks is its key service). It covers PostgreSQL Flexible
Server (the `profiles` database), Azure AD B2C (auth), Key Vault (secrets), and a Databricks workspace for
nutrition/wellness pipelines.

This is **backend infrastructure only** — the frontend stays on GitHub Pages, and the app code still uses
`@supabase/supabase-js`. Rewiring `src/lib/` to the Azure SDKs is a tracked follow-up. See
`infra/terraform/README.md` for the Supabase → Azure mapping and apply steps.

Related docs:

- `docs/nutrition-mvp-spec.md` defines scope, out-of-scope items, and success metrics.
- `docs/nutrition-workflow.md` explains the current user workflow and manual grocery-app handoff.
- `docs/nutrition-data-model.md` documents the household, member, meal template, weekly plan, and grocery checklist model.
- `docs/supabase-activity-check.md` documents a lightweight hosted Supabase smoke check for active MVP environments.
- `docs/portable-postgres.md` documents the local Podman/Docker Postgres test harness for relational portability.
- `docs/backlog/nutrition-mvp-backlog.md` links the nutrition backlog issues and priority sequence.
- `docs/testing.md` explains local and CI test coverage.
- `infra/terraform/README.md` documents the Azure Terraform stack that replaces Supabase (Postgres, Azure AD B2C, Key Vault, Databricks).

## Testing

Run the same checks used by CI:

```bash
npm run lint
npm run build
npm run test:e2e
```

The Playwright config starts `npm run preview` automatically against the built app. The CI workflow in `.github/workflows/ci.yml` runs lint, build, and the Playwright suite for pull requests and pushes to `main`.

If Playwright browsers are missing locally, install Chromium once:

```bash
npx playwright install chromium
```

## Deployment

This repo includes `.github/workflows/deploy-pages.yml` to publish the app to GitHub Pages on pushes to `main`.

1. In GitHub, open `Settings -> Pages` and set the source to `GitHub Actions`.
2. Push to `main` or run the workflow manually from the Actions tab.
3. The workflow builds with `VITE_BASE_PATH=/<repo-name>/` so assets resolve correctly under `https://<owner>.github.io/<repo-name>/`.

For a custom domain, set the repository variable `PAGES_CNAME`. The workflow writes `dist/CNAME` automatically when that variable is present.

## Project structure

- `src/components/` contains React UI sections and reusable page blocks.
- `src/data/nutrition.ts` contains the nutrition domain model, seed data, grocery generation, and share-output helpers.
- `infra/terraform/` contains the Azure Terraform stack (Postgres, Azure AD B2C, Key Vault, Databricks) that replaces Supabase.
- `tests/e2e/` contains Playwright browser tests.
- `.github/workflows/ci.yml` runs PR verification.
- `.github/workflows/deploy-pages.yml` publishes the static build to GitHub Pages.
- `vite.config.ts` sets the deploy base path.
- `eslint.config.js` contains the flat ESLint configuration.
