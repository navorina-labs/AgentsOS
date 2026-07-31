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
  This requires the `DATABASE_URL` to be set.

### Note
- If you want to create a key without registering a team in the database, you can run:
  ```bash
  npm run issue:key
  ```
  This will generate a `ma_*` token and provide instructions for setting it as a wrangler secret.
