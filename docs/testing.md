# Testing

The repo uses three checks for the current MVP:

- ESLint for static code checks.
- Vite production build for compile and bundling checks.
- Playwright for browser-level nutrition planner workflows.

## Local checks

Run all checks before marking the PR ready:

```bash
npm run lint
npm run build
npm run test:e2e
```

The Playwright config starts `npm run preview` automatically against the built app.

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
- Verifying the copy handoff flow.

## CI

`.github/workflows/ci.yml` runs on pull requests and pushes to `main`.

The workflow:

- installs dependencies with `npm ci`,
- installs the Chromium Playwright browser,
- runs `npm run lint`,
- runs `npm run build`,
- runs `npm run test:e2e`,
- uploads the Playwright report artifact when available.

## Known local environment notes

Some sandboxed environments block localhost ports unless explicitly allowed. If Playwright fails to start the preview server with a listen permission error, rerun the command in an environment that can bind to `127.0.0.1`.
