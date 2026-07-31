# MA12 (B)

## Answer

To run production tests for MailAgent, follow these steps:

1. **Set Environment Variables:**
   - Ensure you have the following environment variables set:
     - `MAILAGENT_API_URL=https://api.webmailagent.com`
     - `MAILAGENT_API_KEY=<your_api_key>`

2. **Run Production Gate Tests:**
   - For a light production gate test (after deployment):
     ```bash
     npm run test:prod:gate
     ```
   - For a full production test (before release):
     ```bash
     npm run test:prod
     ```

3. **Check Results:**
   - Monitor the output for any errors or failures during the tests. Any step with a non-zero exit code will stop the pipeline.

Make sure you have the necessary permissions and access to the API key for the tests to run successfully.
