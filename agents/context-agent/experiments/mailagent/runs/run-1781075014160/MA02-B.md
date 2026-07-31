# MA02 (B)

## Answer

To deploy MailAgent to production, follow these steps:

1. **Login to Wrangler**:
   ```bash
   npx wrangler login
   ```

2. **Set Secrets**:
   - Add the required secrets using the following commands:
   ```bash
   npx wrangler secret put DATABASE_URL
   npx wrangler secret put RESEND_API_KEY
   npx wrangler secret put RESEND_WEBHOOK_SECRET
   npx wrangler secret put API_KEY
   npx wrangler secret put INBOX_DOMAIN
   ```

3. **Create R2 Bucket**:
   ```bash
   npx wrangler r2 bucket create mailagent-raw-mime
   ```

4. **Deploy the Application**:
   ```bash
   npm run deploy
   ```

5. **Run Database Migrations**:
   ```bash
   npm run db:migrate
   ```

6. **Update Resend Webhook**:
   - Change the webhook URL to the production URL.

7. **(Optional)**: Set up a custom domain for the API (e.g., `api.webmailagent.com`).

Make sure you have completed the prerequisites and configured the environment variables as needed.
