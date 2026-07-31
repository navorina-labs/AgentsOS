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

1. **Clone the Repository and Install Dependencies**
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   npm install
   ```

2. **Configure Neon Postgres**
   - Create a project on [neon.tech](https://neon.tech).
   - Enable **Connection pooling** and copy the connection string.
   - Set the connection string in `.dev.vars` as `DATABASE_URL=...`.
   - Run migrations:
   ```bash
   DATABASE_URL="postgresql://..." npm run db:migrate
   ```

3. **Configure Resend**
   - Obtain the API key from [resend.com](https://resend.com) and set it as `RESEND_API_KEY`.
   - Set the receiving domain in `.dev.vars` as `INBOX_DOMAIN=abc123.resend.app`.
   - Configure webhooks for `email.received` to point to your Cloudflare Worker URL.

4. **Set Local Secrets**
   - Copy the example files:
   ```bash
   cp .dev.vars.example .dev.vars
   cp .env.example .env
   ```
   - Fill in the necessary values, ensuring `API_KEY` is the same in both files.

5. **Deploy to Cloudflare**
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
   - Deploy the Worker:
   ```bash
   npm run deploy
   ```

6. **Post-Deployment**
   - Run database migrations again if necessary:
   ```bash
   npm run db:migrate
   ```
   - Update the Resend webhook URL to point to the production Worker URL.

### Verify Deployment
- Check the health of the deployed service:
```bash
curl https://api.webmailagent.com/health
```

### Additional Notes
- Ensure to follow the setup for any optional features or configurations as needed.
- Refer to the [SETUP.md](./SETUP.md) for detailed instructions and troubleshooting.
