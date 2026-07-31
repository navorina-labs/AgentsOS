# MA02 (A)

## Answer

To deploy MailAgent to production, follow these steps:

1. **Set Up Neon Postgres:**
   - Create a project on [neon.tech](https://neon.tech) and copy the connection string.
   - Create a `.env` file from `.env.example` and fill in the `DATABASE_URL`.
   - Run database migrations:
     ```bash
     DATABASE_URL="postgresql://..." npm run db:migrate
     ```

2. **Set Up Resend:**
   - Obtain your API key from [resend.com](https://resend.com) and set it as `RESEND_API_KEY`.
   - Copy the domain from the Resend dashboard (e.g., `xxxx.resend.app`) and set it as `INBOX_DOMAIN`.
   - Configure webhooks in Resend to point to your MailAgent worker URL.

3. **Configure Worker Secrets:**
   - Use the following commands to set the necessary secrets in Cloudflare Workers:
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
   - Check the health of your deployment:
     ```bash
     curl https://api.webmailagent.com/health
     ```

6. **Set Up Custom Domain (Optional):**
   - If using a custom domain, configure it in Cloudflare and ensure it points to your worker.

7. **Run Post-Deployment Checks:**
   - After deployment, run the following commands to ensure everything is functioning correctly:
     ```bash
     npm run smoke:qa
     npm run smoke:agent
     ```

8. **Monitor and Maintain:**
   - Regularly check the logs and performance metrics to ensure the service is running smoothly.

For detailed instructions, refer to the relevant sections in the provided documentation files, especially `SETUP.md` and `YOUR-TURN.md`.
