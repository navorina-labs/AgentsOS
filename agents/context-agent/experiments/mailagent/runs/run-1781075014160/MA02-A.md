# MA02 (A)

## Answer

To deploy MailAgent to production, follow these steps:

1. **Set Up Neon Postgres:**
   - Create a project on [neon.tech](https://neon.tech) and copy the connection string.
   - Fill in the `DATABASE_URL` in `.dev.vars`.
   - Run migrations:
     ```bash
     DATABASE_URL="postgresql://..." npm run db:migrate
     ```

2. **Set Up Resend:**
   - Obtain the API key from Resend and set it as `RESEND_API_KEY`.
   - Configure the receiving domain in Resend and set `INBOX_DOMAIN`.
   - Set up webhooks in Resend to point to your MailAgent worker.

3. **Configure Environment Variables:**
   - Create a `.env` file and fill in the required secrets:
     ```bash
     npx wrangler secret put DATABASE_URL
     npx wrangler secret put RESEND_API_KEY
     npx wrangler secret put RESEND_WEBHOOK_SECRET
     npx wrangler secret put API_KEY
     npx wrangler secret put INBOX_DOMAIN
     ```

4. **Deploy the Worker:**
   - Run the deployment command:
     ```bash
     npm run deploy
     ```

5. **Verify Deployment:**
   - Check the health of the deployed service:
     ```bash
     curl https://api.webmailagent.com/health
     ```

6. **Run Post-Deployment Checks:**
   - Run smoke tests to ensure everything is functioning:
     ```bash
     npm run smoke:qa
     npm run smoke:agent
     ```

7. **Set Up GitHub Actions (Optional):**
   - Ensure that the required secrets are set in GitHub Actions for CI/CD.

8. **Monitor and Maintain:**
   - Regularly check the logs and performance metrics to ensure the service is running smoothly.

For detailed steps and configurations, refer to the relevant sections in the provided documentation files, especially `SETUP.md`, `README.md`, and `docs/CI.md`.
