# MA02 (B)

## Answer

To deploy MailAgent to production, follow these steps:

### Prerequisites
- Ensure you have a Cloudflare account and are logged in (`npx wrangler login`).
- Set up Neon Postgres with connection pooling.
- Obtain the necessary API keys from Resend.

### Deployment Steps
1. **Set Worker Secrets**:
   ```bash
   npx wrangler secret put DATABASE_URL
   npx wrangler secret put RESEND_API_KEY
   npx wrangler secret put RESEND_WEBHOOK_SECRET
   npx wrangler secret put API_KEY
   npx wrangler secret put INBOX_DOMAIN
   ```

2. **Create R2 Bucket**:
   - Enable R2 in the Cloudflare Dashboard.
   - Create the bucket:
   ```bash
   npx wrangler r2 bucket create mailagent-raw-mime
   ```

3. **Deploy the Worker**:
   ```bash
   npm run deploy
   ```

4. **Run Database Migrations**:
   - Ensure `DATABASE_URL` is set in your environment or secrets.
   ```bash
   npm run db:migrate
   ```

5. **Post-Deployment Verification**:
   - Verify the deployment by running:
   ```bash
   MAILAGENT_API_URL=https://api.webmailagent.com \
   MAILAGENT_API_KEY=ma_… \
   npm run test:prod:gate
   ```

### Additional Notes
- Ensure that the custom domain `api.webmailagent.com` is set up correctly in Cloudflare.
- Check the Resend webhook URL to point to the production endpoint.
- Monitor the deployment for any issues using the health endpoints.
