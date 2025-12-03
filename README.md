# Fitness Assistant MVP

A static single-page experience for the LensKeep fitness assistant MVP. Built with React, TypeScript, Vite, and Tailwind CSS so it can be deployed as a lightweight S3 website.

> The project now lives in its own repository at https://github.com/edwin-lobo/fitness-assistant. Use the instructions in this README to set up AWS + GitHub OIDC and deploy from that repository.

## Getting started

```bash
cd fitness-assistant
npm install
npm run dev
```

> If your network restricts access to the npm registry, set the registry that works in your environment before running `npm install`.

## Production build

```bash
npm run build
```

The static assets will be emitted to `dist/` and can be hosted on Amazon S3 or fronted by CloudFront.

## Deploying to S3 (summary)

1. Create or choose an S3 bucket and enable static website hosting.
2. Run `npm run build` and upload the `dist/` contents to the bucket root.
3. Set the index document to `index.html` and adjust the bucket policy for public read (or serve privately behind CloudFront).
4. For CloudFront, point the origin at the bucket and cache the static assets with long TTLs.

### GitHub Actions + AWS OIDC deployment

- The repository includes `.github/workflows/deploy.yml`, which builds the Vite app and syncs `dist/` into S3.
- Set repository/environment **variables**:
  - `AWS_REGION` – target AWS region.
  - `FITNESS_ASSISTANT_S3_BUCKET` – bucket name where the static site is published.
  - `FITNESS_ASSISTANT_CLOUDFRONT_ID` (optional) – CloudFront distribution ID for cache invalidations.
- Set repository **secrets**:
  - `FITNESS_ASSISTANT_DEPLOY_ROLE_ARN` – IAM role ARN assumed via GitHub OIDC.

Recommended IAM trust policy (scope to this repo and branch):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": { "Federated": "arn:aws:iam::<ACCOUNT_ID>:oidc-provider/token.actions.githubusercontent.com" },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
          "token.actions.githubusercontent.com:sub": "repo:edwin-lobo/fitness-assistant:ref:refs/heads/main"
        }
      }
    }
  ]
}
```

The role needs S3 write permissions for the target bucket and optional CloudFront invalidation rights. The workflow uses `actions/configure-aws-credentials` with the role ARN secret and the region/bucket identifiers from repository variables so no long-lived AWS keys are stored in GitHub.

## Linting

```bash
npm run lint
```

## Project structure

- `src/components/` – presentational React components for the landing page sections.
- `src/App.tsx` – page composition and hero copy.
- `tailwind.config.ts` / `postcss.config.js` – styling pipeline configuration.
- `vite.config.ts` – Vite bundler configuration.

## Moving to a dedicated GitHub repository

If you want this app (and its deploy workflow) to live in its own repo, follow the step-by-step export guide in
`NEW_REPO_SETUP.md`. It covers using sparse checkout to keep history, pushing to a new remote (e.g.,
`github.com/edwin-lobo/fitness-assistant`), and wiring the AWS OIDC secrets/variables in the new repository.
