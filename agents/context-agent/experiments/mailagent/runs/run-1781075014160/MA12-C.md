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
   - Execute the full suite of production tests:
     ```bash
     npm run test:prod
     ```
   - This command runs all contract tests and Playwright tests.

3. **Run Smoke Tests** (optional):
   - For a quick smoke test after deployment, use:
     ```bash
     npm run test:prod:gate
     ```
   - This runs a minimal set of tests (~15 API calls).

4. **Check for Specific Changes**:
   - If you have made changes to specific files, run targeted tests:
     - For changes in `src/routes/agent.ts` or the MCP hub:
       ```bash
       npm run test:contract:qa:agent
       ```
     - For inbox, simulate, or extract changes:
       ```bash
       npm run test:contract:qa
       ```

5. **Review Results**:
   - Check the output for any errors or failures and address them accordingly.

Make sure to refer to the documentation for any additional configurations or specific test scenarios.
