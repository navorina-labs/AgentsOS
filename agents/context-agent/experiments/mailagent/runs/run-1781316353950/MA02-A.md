# MA02 (A)

## Answer

To deploy MailAgent to production, follow these steps:

1. **Set Up Neon Postgres:**
   - Create a project on [neon.tech](https://neon.tech) and copy the connection string.
   - Fill in the `.env` file with `DATABASE_URL`.
   - Run migrations:
     ```bash
     DATABASE_URL="postgresql://..." npm run db:migrate
     ```

2. **Set Up Resend:**
   - Obtain your API key from [resend.com](https://resend.com) and set `RESEND_API_KEY`.
   - Configure the receiving domain and webhooks in Resend.

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
   - Check the health of the deployed service:
     ```bash
     curl https://api.webmailagent.com/health
     ```

6. **Run Migrations (if needed):**
   - If there are any new migrations, run:
     ```bash
     npm run db:migrate
     ```

7. **Set Up Billing (Optional):**
   - If you want to enable billing, follow the instructions in `STRIPE-SETUP.md`.

8. **Check Everything:**
   - Ensure that all configurations are correct and that the service is functioning as expected.

For detailed steps, refer to the relevant sections in the provided documentation, such as `SETUP.md`, `STRIPE-SETUP.md`, and `YOUR-TURN.md`.
