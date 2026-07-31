# MA12 (B)

## Answer

To run production tests for MailAgent, you can use the following commands:

### Smoke Tests
- Basic production check:
  ```bash
  MAILAGENT_API_URL=https://api.webmailagent.com \
  MAILAGENT_API_KEY=ma_… \
  npm run smoke:prod
  ```

### Full Production Gate
- To run all smoke tests and contracts:
  ```bash
  npm run test:prod
  ```

### Smoke Only (CI Default)
- To run only smoke tests (approximately 15 API calls):
  ```bash
  npm run test:prod:gate
  ```

Make sure to set the `MAILAGENT_API_URL` and `MAILAGENT_API_KEY` environment variables appropriately before running the tests.
