# Creating a dedicated GitHub repository for the Fitness Assistant

The app currently lives in a multi-project repository. Use these steps to lift it into its own GitHub repository with the existing CI/CD workflow. A ready-to-use repository is available at https://github.com/edwin-lobo/fitness-assistant if you prefer to push directly there.

## 1) Create the repository

- Decide on the new repository name (e.g., `fitness-assistant-mvp`). If you want to use the existing public repo, set `NEW_REPO=fitness-assistant` and `OWNER=edwin-lobo` in the commands below.
- Create the repo in GitHub with **no** template files so the history from this project can be pushed intact (the `edwin-lobo/fitness-assistant` repository is already prepared this way).
- Optionally scope repository rulesets or environments for `main` if you want branch protection or reviewers.

## 2) Prepare the code locally

From the project root:

```bash
# Keep history but filter the fitness-assistant folder into its own branch
OWNER=${OWNER:-<OWNER>}
NEW_REPO=${NEW_REPO:-fitness-assistant-mvp}

git switch --create export-fitness-assistant
# Ensure the working tree is clean
git status

# Use sparse checkout to reduce the tree to just the app and workflow
# (requires Git 2.25+)
git sparse-checkout init --cone
git sparse-checkout set fitness-assistant .github
```

This leaves only `fitness-assistant/` and `.github/` (for the deploy workflow) checked out.

## 3) Point to the new remote and push

```bash
git remote add new-origin git@github.com:${OWNER}/${NEW_REPO}.git
# Verify files look correct before pushing
ls

# Push the filtered branch as main
git push new-origin export-fitness-assistant:main
```

If you prefer a clean history, you can `git init` in a fresh folder and copy the `fitness-assistant/` and `.github/` directories into it instead, then run `git add . && git commit` before pushing to the new remote.

## 4) Configure GitHub Actions secrets/variables in the new repo

Set the following in the new repository (or an environment) to enable the existing `.github/workflows/deploy.yml` pipeline:

- **Variables**
  - `AWS_REGION` – target AWS region
  - `FITNESS_ASSISTANT_S3_BUCKET` – S3 bucket for the static build
  - `FITNESS_ASSISTANT_CLOUDFRONT_ID` – CloudFront distribution ID (optional)
- **Secret**
  - `FITNESS_ASSISTANT_DEPLOY_ROLE_ARN` – IAM role ARN assumed via OIDC

## 5) AWS trust policy reminder

Ensure the IAM role trusts the new repository. Update the `repo:<OWNER>/<NEW_REPO>:ref:refs/heads/main` subject in the trust policy (for the public repo, use `repo:edwin-lobo/fitness-assistant:ref:refs/heads/main`). You can copy the sample policy from `fitness-assistant/README.md`.
