# MA25 (B)

## Answer

To create a team API key, you can use the following methods:

### CLI
- Run the command:
  ```bash
  npm run issue:key:db -- pilot-name
  ```
  Replace `pilot-name` with the desired name for the team.

### Runtime API
- Use the `registerApiKey()` function, which creates a new team and the first API key.

### Programmatic
- Use the script:
  ```bash
  scripts/issue-api-key.mjs --register
  ```
  This requires the `DATABASE_URL`.

### Issue Key without DB
- To generate a `ma_*` token without registering in the database, run:
  ```bash
  npm run issue:key
  ```
  This will provide instructions to set the `API_KEYS` in wrangler secrets.

### Notes
- The key will be created with the default plan set to `free`.
- Ensure you have the necessary environment variables and secrets configured before running these commands.
