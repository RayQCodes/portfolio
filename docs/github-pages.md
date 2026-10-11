# GitHub Pages publishing

The portfolio is a React/Vite application hosted at https://raymondwquan.com.
Its only publishing workflow is `.github/workflows/pages.yml`. Existing branches
were checked for custom publishing workflows; none were present. The old
`gh-pages` branch is retained, but no workflow or npm command pushes to it.

The workflow installs Node.js 24, runs `npm ci` and `npm run build`, and uploads
only `dist/` with GitHub's official Pages artifact action. The deploy job publishes
that artifact using GitHub's automatically supplied workflow authentication.
No additional deployment secret is needed. Pull requests build and check the
output but cannot publish it. Deployments are serialized.

## Activation after approval

This change is prepared for review; no production configuration or deployment
has been changed or triggered.

1. Approve this pull request and the switch to the artifact-based Pages workflow.
2. In **Settings → Pages → Build and deployment**, choose **GitHub Actions** as
   the source. Keep the existing custom domain **raymondwquan.com** and
   **Enforce HTTPS** enabled. Do not change DNS records.
3. Merge the approved change into `feat/cloud-portfolio-redesign`. Its push
   triggers the build and deployment. This is the only publishing branch.
4. Check the workflow's deployment URL, rendered portfolio, assets, and the
   resume download after the run succeeds.

Switching the source to GitHub Actions replaces the legacy branch publisher;
do not retain a separate action that pushes `dist/` to `gh-pages`. This avoids
competing deployment paths. The workflow does not change the Pages source or
custom-domain settings itself, and it will not publish successfully until the
source is switched.

`workflow_dispatch` is an optional retry mechanism for the publishing branch.
GitHub only exposes manual dispatch when the workflow file also exists on the
repository's default branch (`master`). Until then, an approved push to the
publishing branch is the supported trigger. If the publishing branch changes
later, update both branch filters and the deploy job's ref condition together.

`public/CNAME` matches the configured Pages domain, so Vite copies the correct
CNAME into `dist/`. Asset paths remain rooted at `/` for the custom domain.
The build verifies the domain and compares the published resume to its source
PDF. `node_modules/`, `dist/`, and `.cache/` remain ignored; commit source files
and the lockfile rather than generated bundles or dependency caches.

## Local verification

From the checkout:

```sh
npm ci
npm run build
npm run preview
```

Confirm the new headline, all four featured projects, dark mode, mobile
navigation, and the updated PDF download. No application design or resume
changes are required for publishing.
