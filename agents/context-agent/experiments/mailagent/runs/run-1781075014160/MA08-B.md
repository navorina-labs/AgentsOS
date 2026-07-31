# MA08 (B)

## Answer

The Cloudflare Worker is structured as follows:

- **Configuration File:** `wrangler.jsonc`
  - Name: `mailagent`
  - Main Entry: `src/index.ts`
  - Account ID: `42ae092824ce3429ee3f914b43603273`
  - Compatibility Date: `2026-01-15`, `nodejs_compat_v2`

- **Bindings:**
  - `ASSETS`: Assets for static site (`public/`)
  - `DATABASE_URL`: Secret for Neon database
  - `MAIL_QUEUE`: Queue for `mailagent-email`
  - `INBOX_WAIT`: Durable Object for SSE wait
  - `RATE_LIMIT`: KV for rate limiting
  - `RAW_MIME`: R2 for `.eml` archive
  - `AI`: Workers AI for embeddings and extraction
  - `RESEND_*`, `API_KEY`, `INBOX_DOMAIN`: Secrets for email and authentication

- **Entry Export (`src/index.ts`):**
  - `fetch`: Handles API vs static routing
  - `queue`: Handles queue batch processing
  - `scheduled`: Cron job for purging

- **Routing (`handleFetch`):**
  1. Redirects HTTP to HTTPS (for production hosts)
  2. Redirects www to apex domain
  3. Routes API paths to `Hono app.fetch`
  4. Serves static assets for other requests

- **Business Logic:**
  - **Routes (HTTP layer)** located in `src/routes/`
  - **Services (business logic)** located in `src/services/`
  - **Lib (shared utilities)** located in `src/lib/`
  - **Queue** for async email processing in `src/queue/consumer.ts`
  - **Durable Objects** for managing state in `src/durable-objects/inbox-wait.ts`
  - **MCP** related files in `src/mcp/`
  - **Database Client** in `src/db/client.ts`

- **Cron Jobs:**
  - Scheduled tasks for purging expired inboxes and audit events.

- **Local Development and Deployment:**
  - Local dev command: `npm run dev`
  - Deployment command: `npm run deploy`
  - CI for deployment on push to main branch.
