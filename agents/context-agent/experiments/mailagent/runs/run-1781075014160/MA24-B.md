# MA24 (B)

## Answer

On push to `main`, the following CI workflow runs:

- **Workflow:** `deploy-worker.yml`
  - **Action:** Executes `wrangler deploy` followed by `test:prod:gate`.
