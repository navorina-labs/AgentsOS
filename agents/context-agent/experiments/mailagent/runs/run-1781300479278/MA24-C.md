# MA24 (C)

## Answer

On push to the `main` branch, the following CI workflows are triggered:

- **Deploy Worker**: 
  - Workflow file: `.github/workflows/deploy-worker.yml`
  - Outcome: Deploys the Worker and runs `npm run test:prod:gate` (smoke test).

- **Security Baseline**: 
  - Workflow file: `.github/workflows/security-baseline.yml`
  - Outcome: Runs `npm run doctor:security`, `verify:codex`, and `npm audit` (high+).

- **Other Workflows**: 
  - Additional workflows may run based on specific conditions, such as `qa-smoke.yml` for PRs or `test-prod-full.yml` for manual dispatch.

### Secrets Required for CI:
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `MAILAGENT_API_KEY` (required for production gate)
- `DATABASE_URL` (optional)

### Note:
- Changes only in `package.json`, `scripts/`, or `docs/` do not trigger a deployment.
