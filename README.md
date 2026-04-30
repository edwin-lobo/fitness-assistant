# Fitness Assistant

Fitness Assistant is a static React, TypeScript, and Vite app for planning workouts and household nutrition routines. The current MVP focuses on a low-friction nutrition planner that turns a repeatable weekly meal plan into a grocery checklist.

## Current Status

- Draft PR: https://github.com/edwin-lobo/fitness-assistant/pull/14
- Implemented nutrition issues: `#1` through `#4`
- Next backlog batch: `#5` through `#8`
- Deployment target: GitHub Pages

## Local development

```bash
npm install
npm run dev
```

If your environment restricts access to the npm registry, configure the registry that works for you before running `npm install`.

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

Implemented in this PR:

- Editable household member profiles.
- Low-choice weekly meal planning.
- Repeatable meal templates.
- Grocery checklist generation with duplicate consolidation.
- Copy, email, and text output for manual grocery-app handoff.
- Playwright browser coverage for the main nutrition workflow.

Related docs:

- `docs/nutrition-mvp-spec.md` defines scope, out-of-scope items, and success metrics.
- `docs/nutrition-data-model.md` documents the household, member, meal template, weekly plan, and grocery checklist model.
- `docs/backlog/nutrition-mvp-backlog.md` links the nutrition backlog issues and priority sequence.
- `docs/testing.md` explains local and CI test coverage.

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
- `tests/e2e/` contains Playwright browser tests.
- `.github/workflows/ci.yml` runs PR verification.
- `.github/workflows/deploy-pages.yml` publishes the static build to GitHub Pages.
- `vite.config.ts` sets the deploy base path.
- `eslint.config.js` contains the flat ESLint configuration.
