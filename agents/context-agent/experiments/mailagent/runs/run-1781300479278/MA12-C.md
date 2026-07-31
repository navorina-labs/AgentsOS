# MA12 (C)

## Answer

To run production tests for MailAgent, follow these steps:

1. **Set Environment Variables**:
   - Set the following environment variables:
     ```bash
     export MAILAGENT_API_URL=https://api.webmailagent.com
     export MAILAGENT_API_KEY=your_key
     ```

2. **Run Production Tests**:
   - Execute the full suite of production tests using:
     ```bash
     npm run test:prod
     ```
   - This command runs all contract tests and Playwright tests.

3. **Run Smoke Tests**:
   - For a minimal smoke test after deployment, use:
     ```bash
     npm run test:prod:gate
     ```

4. **CI Integration**:
   - In CI, the production tests are automatically triggered after deployment with the command `npm run test:prod:gate`.

5. **Check for Specific Changes**:
   - If you change specific files or components, run targeted tests:
     - For changes in `src/routes/agent.ts`, run:
       ```bash
       npm run test:contract:qa:agent
       ```
     - For inbox or simulate changes, run:
       ```bash
       npm run test:contract:qa
       ```

Make sure to refer to the documentation for any additional configurations or specific test scenarios.
