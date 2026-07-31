# MA24 (C)

## Answer

On push to the `main` branch, the following CI workflows are triggered:

- **Deploy Worker** (`deploy-worker.yml`):
  - Triggers on changes to specific paths (`src/`, `public/`, `wrangler.jsonc`, `package-lock.json`).
  - Deploys the Worker and runs `npm run test:prod:gate` (smoke tests).

- **Security Baseline** (`security-baseline.yml`):
  - Runs on every push/PR to `main` and weekly.
  - Executes `npm run doctor:security`, `verify:codex`, and `npm audit`.

- **Publish Packages** (`publish-packages.yml`):
  - Triggers on tagging a version (`v*`).

- **Other Workflows**:
  - Additional workflows may run based on specific conditions or manual dispatch.

For more details, refer to the `docs/CI.md` file.
