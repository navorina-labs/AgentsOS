# MA02 (C)

## Answer

To deploy MailAgent to production, follow these steps:

### Prerequisites
1. **Cloudflare account** (ensure `account_id` is set in `wrangler.jsonc`).
2. **Neon Postgres project**.
3. **Resend account** (set up receiving domain and webhook).
4. **Node.js** and **npm** installed.

### Deployment Steps
1. **Clone the repository and install dependencies**:
   ```bash
   git clone https://github.com/Alex0nder/MailAgent.git
   cd MailAgent
   npm install
   ```

2. **Set up Neon**:
   - Copy the example environment file:
     ```bash
     cp .env.example .env
     ```
   - Fill in the `DATABASE_URL` in `.env` with your Neon connection string.
   - Run database migrations:
     ```bash
     npm run db:migrate
     ```

3. **Configure local secrets**:
   - Copy the example secrets file:
     ```bash
     cp .dev.vars.example .dev.vars
     ```
   - Fill in the required fields in `.dev.vars` (e.g., `DATABASE_URL`, `RESEND_API_KEY`, `RESEND_WEBHOOK_SECRET`, `API_KEY`, `INBOX_DOMAIN`).

4. **Set up Resend webhook**:
   - Ensure the webhook for `email.received` points to your Cloudflare Worker URL (e.g., `https://<tunnel>/webhooks/resend` for local development).

5. **Run locally for testing**:
   ```bash
   npm run dev          # Start the local server
   npm run verify       # Run smoke tests
   ```

6. **Deploy to production**:
   - Log in to Cloudflare:
     ```bash
     npx wrangler login
     ```
   - Set the required secrets:
     ```bash
     npx wrangler secret put DATABASE_URL
     npx wrangler secret put RESEND_API_KEY
     npx wrangler secret put RESEND_WEBHOOK_SECRET
     npx wrangler secret put API_KEY
     npx wrangler secret put INBOX_DOMAIN
     ```
   - Create an R2 bucket for raw MIME storage:
     ```bash
     npx wrangler r2 bucket create mailagent-raw-mime
     ```
   - Deploy the application:
     ```bash
     npm run deploy
     npm run db:migrate
     ```

7. **Update Resend webhook to production URL**:
   - Change the webhook URL in Resend to point to your production Cloudflare Worker.

8. **Optional: Set up a custom domain for the API**:
   - Follow the instructions in the setup documentation to configure `api.webmailagent.com` as a custom domain.

### Additional Notes
- Ensure that your environment variables are correctly set in the production environment.
- Monitor the deployment and check logs for any issues. Use the health check endpoint (`GET /health`) to verify the service is running correctly.
