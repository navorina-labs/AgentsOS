# MA12 (A)

## Answer

To run production tests for MailAgent, follow these steps:

1. **Set Environment Variables**:
   - Ensure you have the following environment variables set:
     ```bash
     MAILAGENT_API_URL=https://api.webmailagent.com
     MAILAGENT_API_KEY=your_api_key_here
     ```

2. **Run Production Tests**:
   - For a full suite of production tests, execute:
     ```bash
     npm run test:prod
     ```
   - For a smoke test (CI post-deploy), execute:
     ```bash
     npm run test:prod:gate
     ```

3. **Test Layers**:
   - The full production test (`test:prod`) includes:
     - Smoke tests for the agent and QA.
     - Contract tests for all API endpoints.
     - Playwright tests for UI interactions.

4. **Before Merge**:
   - Always run `npm run test:prod` before merging any changes to ensure everything is functioning correctly.

5. **Check for Failures**:
   - If any tests fail, use:
     ```bash
     npm run doctor:qa
     ```
   - This command will help diagnose issues in the local environment.

Make sure to consult the **[AUTOTESTS.md](docs/AUTOTESTS.md)** for more detailed instructions and options related to autotests.
