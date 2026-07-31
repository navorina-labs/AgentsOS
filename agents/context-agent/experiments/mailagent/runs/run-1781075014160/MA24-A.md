# MA24 (A)

## Answer

On push to the main branch, the following actions run in CI:

- Deploy the Worker.
- Execute the `test:prod:gate` command, which performs a smoke test (minimal checks).
  
If the push includes changes to specific files (like `src/`, `public/`, `wrangler.jsonc`, or `package-lock.json`), the Worker is deployed. Changes only in `package.json`, `scripts/`, or `docs/` do not trigger a deployment.
