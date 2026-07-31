# MA24 (C)

## Answer

On push to the main branch, the following CI workflows are triggered:

- **`deploy-worker.yml`**: 
  - Action: Deploys the worker and runs `npm run test:prod:gate` (smoke test).
  - Trigger: Changes in `src/`, `public/`, `wrangler.jsonc`, `package-lock.json`.

- **`security-baseline.yml`**: 
  - Action: Runs `npm run doctor:security` to check security.
  - Trigger: Every push/PR to `main`, weekly, or manual run.

- **`hol-plugin-scanner.yml`**: 
  - Action: Checks Codex catalog score.
  - Trigger: On PR.

- **`qa-smoke.yml`**: 
  - Action: Runs checks, verifies Codex, smoke tests, and contract tests.
  - Trigger: PRs or branches starting with `qa/`.

- **`test-prod-full.yml`**: 
  - Action: Runs the full `test:prod` suite.
  - Trigger: Manual run.

- **`publish-packages.yml`**: 
  - Action: Publishes npm packages via OIDC.
  - Trigger: Tagging a version (e.g., `v*`). 

These workflows ensure deployment, security checks, and testing are performed automatically with each push to the main branch.
