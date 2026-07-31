# MA24 (B)

## Answer

On push to main, the following actions run in CI:

- **Trigger:** `deploy-worker.yml`
- **Actions:**
  - `check`
  - `verify:codex`
  - Optional `db:migrate`
  - `wrangler deploy`
  - **Mandatory:** `test:prod:gate`

**Secrets used:**
- `CLOUDFLARE_*`
- `MAILAGENT_API_KEY`
- Optionally `DATABASE_URL`
