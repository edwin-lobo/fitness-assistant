# Fitness Assistant

Static React, TypeScript, and Vite app for the fitness assistant MVP.

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

The nutrition feature is a household-first planner for two adults who want lower-friction weekly planning and fewer processed foods.

- `docs/nutrition-mvp-spec.md` defines the MVP scope, out-of-scope items, and week-one success metrics.
- `docs/nutrition-data-model.md` documents the household, member, meal template, weekly plan, and grocery checklist model.
- `docs/backlog/nutrition-mvp-backlog.md` links the nutrition backlog issues and priority sequence.

The current app supports editable household member profiles, low-choice weekly meal planning, grocery checklist generation, and copy/email/text output for manual FamilyWall handoff.

## Testing

The repo includes Playwright browser tests for the nutrition planner in `tests/e2e/`.

```bash
npm run build
npm run test:e2e
```

The Playwright config starts `npm run preview` automatically against the built app. The CI workflow in `.github/workflows/ci.yml` runs lint, build, and the Playwright suite for pull requests and pushes to `main`.

## Deployment

This repo includes `.github/workflows/deploy-pages.yml` to publish the app to GitHub Pages on pushes to `main`.

1. In GitHub, open `Settings -> Pages` and set the source to `GitHub Actions`.
2. Push to `main` or run the workflow manually from the Actions tab.
3. The workflow builds with `VITE_BASE_PATH=/<repo-name>/` so assets resolve correctly under `https://<owner>.github.io/<repo-name>/`.

For a custom domain, set the repository variable `PAGES_CNAME`. The workflow writes `dist/CNAME` automatically when that variable is present.

## Project structure

- `src/components/` contains the page sections and UI blocks.
- `src/App.tsx` composes the landing page.
- `vite.config.ts` sets the deploy base path.
- `eslint.config.js` contains the flat ESLint configuration.
