# MA02 (C)

## Answer

To deploy MailAgent to production, follow these steps:

### Prerequisites
- Ensure you have:
  - Node.js 22+
  - A Cloudflare account
  - A Neon account
  - A Resend account

### Setup Steps

1. **Neon Postgres Setup (5 min)**
   - Create a new project on [neon.tech](https://neon.tech).
   - Enable **Connection pooling** and copy the connection string.
   - Set the connection string in `.dev.vars` as `DATABASE_URL`.
   - Run migrations:
     ```bash
     DATABASE_URL="postgresql://..." npm run db:migrate
     ```

2. **Resend Setup (10 min)**
   - Go to [resend.com](https://resend.com) and create an API key (`RESEND_API_KEY`).
   - Set up the receiving domain (e.g., `abc123.resend.app`) as `INBOX_DOMAIN`.
   - Configure the webhook for `email.received` to point to your Cloudflare Worker URL.
   - Set the signing secret as `RESEND_WEBHOOK_SECRET`.

3. **Local Secrets Configuration**
   - Copy the example files:
     ```bash
     cp .dev.vars.example .dev.vars
     cp .env.example .env
     ```
   - Fill in both files with the appropriate values, ensuring `API_KEY` is the same in both.

4. **Deploy to Cloudflare**
   - Log in to Cloudflare:
     ```bash
     npx wrangler login
     ```
   - Set the necessary secrets:
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
   - Deploy the Worker:
     ```bash
     npm run deploy
     ```
   - Run migrations again if necessary:
     ```bash
     npm run db:migrate
     ```

5. **Configure Custom Domain (Optional)**
   - Set up the custom domain `api.webmailagent.com` in Cloudflare for your Worker.

### Post-Deployment
- Verify the deployment by checking the health endpoint:
  ```bash
  curl https://api.webmailagent.com/health
  ```

### Additional Notes
- Ensure that your API key is set correctly in your environment for production use.
- Monitor the deployment through the Cloudflare dashboard for any issues.
