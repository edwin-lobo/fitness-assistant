# Testing

The repo uses three checks for the current MVP:

- ESLint for static code checks.
- Vite production build for compile and bundling checks.
- Node unit tests for deterministic feature logic and local tooling behavior.
- Playwright for browser-level nutrition planner workflows.
- Portable Postgres tests for relational schema behavior before hosted Supabase deployment.

## Local checks

Run all checks before marking the PR ready:

```bash
npm run lint
npm run build
npm run test:unit
npm run test:portable-db
npm run db:test
npm run test:e2e
```

The Playwright config starts `npm run preview` automatically against the built app.

`npm run db:test` starts the local Postgres container with Docker-compatible commands, applies the local Supabase compatibility bootstrap, applies Supabase migrations, and runs SQL assertions from `database/tests`.

## Unit test standard

Add or update unit tests when implementing new feature logic or modifying existing behavior. Use unit tests for deterministic rules such as data transforms, formatting, filtering, role helpers, generated request shapes, and command argument builders. Keep browser tests focused on full user workflows.

The unit suite runs with Node's built-in test runner:

```bash
npm run test:unit
```

Current unit coverage includes:

- nutrition grocery aggregation, lower-processed swaps, template cloning, and share output
- Supabase activity-check request construction and failure handling
- portable database runner command construction

If the Chromium browser is not installed locally, run:

```bash
npx playwright install chromium
```

## Browser coverage

The Playwright suite in `tests/e2e/nutrition-planner.spec.ts` covers:

- Rendering the household meal planner and grocery checklist.
- Editing a member profile.
- Changing a weekly meal selection.
- Verifying the grocery checklist updates.
- Verifying share output stays in sync with the plan.
- Applying reusable week templates.
- Applying low-friction repeat and lower-processed swap actions.
- Switching between full-plan, grocery-only, and reusable-template share formats.
- Verifying the copy handoff flow.

## CI

`.github/workflows/ci.yml` runs on pull requests and pushes to `main`.

The workflow:

- installs dependencies with `npm ci`,
- installs the Chromium Playwright browser,
- runs `npm run lint`,
- runs `npm run build`,
- runs `npm run test:unit`,
- runs `npm run test:e2e`,
- uploads the Playwright report artifact when available.

## Known local environment notes

Some sandboxed environments block localhost ports unless explicitly allowed. If Playwright fails to start the preview server with a listen permission error, rerun the command in an environment that can bind to `127.0.0.1`.
