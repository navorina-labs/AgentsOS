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
   - This command runs all contracts and Playwright tests.

3. **Run Smoke Tests** (optional):
   - For a quick smoke test after deployment, use:
     ```bash
     npm run test:prod:gate
     ```
   - This runs a minimal set of tests (~15 API calls).

4. **CI Integration**:
   - Ensure that the CI pipeline runs `npm run test:prod:gate` after deployment to verify the production environment.

5. **Check for Specific Changes**:
   - If you change specific files, run targeted tests:
     - For changes in `src/routes/agent.ts`, run:
       ```bash
       npm run test:contract:qa:agent
       ```
     - For inbox or simulate changes, run:
       ```bash
       npm run test:contract:qa
       ```

Make sure to check the operator checklist in `OPERATOR.md` for any additional steps or requirements.
