# MA12 (B)

## Answer

To run production tests for MailAgent, follow these steps:

### For Production Gate (Light)
- Use the command:
  ```bash
  npm run test:prod:gate
  ```
- This runs a light gate test after deployment, which includes:
  - `smoke:agent`
  - `smoke:qa`

### For Full Production Tests
- Use the command:
  ```bash
  npm run test:prod
  ```
- This runs a full suite of production tests, which includes:
  - `smoke:agent`
  - `smoke:qa`
  - All contract tests
  - Playwright simulate tests

### Environment Variables
- Ensure you have the following environment variables set:
  - `MAILAGENT_API_URL=https://api.webmailagent.com`
  - `MAILAGENT_API_KEY=<your_api_key>`

### Execution Context
- Run these commands in your terminal after deploying the application to verify its functionality in the production environment.
