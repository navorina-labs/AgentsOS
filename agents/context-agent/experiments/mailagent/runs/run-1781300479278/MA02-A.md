# MA02 (A)

## Answer

To deploy MailAgent to production, follow these steps:

1. **Set Up Neon Postgres:**
   - Create a project on [neon.tech](https://neon.tech) and copy the connection string.
   - Create a `.env` file from `.env.example` and fill in `DATABASE_URL`.
   - Run migrations:
     ```bash
     DATABASE_URL="postgresql://..." npm run db:migrate
     ```

2. **Set Up Resend:**
   - Obtain your API key from [resend.com](https://resend.com) and set it as `RESEND_API_KEY`.
   - Copy the domain for receiving emails (e.g., `xxxx.resend.app`) and set it as `INBOX_DOMAIN`.
   - Configure webhooks in Resend to point to your MailAgent Worker URL.

3. **Configure Worker Secrets:**
   - Use the following commands to set secrets in Cloudflare Workers:
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
   - Check the health of the deployed API:
     ```bash
     curl https://api.webmailagent.com/health
     ```

6. **Run Post-Deployment Checks:**
   - Execute smoke tests to ensure everything is functioning:
     ```bash
     npm run smoke:prod
     npm run smoke:qa
     ```

7. **Set Up Billing (Optional):**
   - If you want to enable billing, follow the instructions in `STRIPE-SETUP.md` to configure Stripe.

8. **Monitor and Maintain:**
   - Regularly check the dashboard and logs for any issues and ensure that the system is running smoothly.

Make sure to refer to the relevant documentation files for detailed instructions on each step, especially for any configurations specific to your environment.
