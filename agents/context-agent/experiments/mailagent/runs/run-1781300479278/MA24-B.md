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

**Path Filter:** Only triggers for changes in `src/`, `public/`, `migrations/`, `wrangler.jsonc`, lockfile, contract scripts, and skills.
