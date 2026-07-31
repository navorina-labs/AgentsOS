# MA08 (C)

## Answer

The Cloudflare Worker for the MailAgent project is structured as follows:

### Configuration
- **Config File**: `wrangler.jsonc`
  - Defines the worker name, main entry point, account ID, and bindings.

### Entry Point
- **Main File**: `src/index.ts`
  - Exports the `fetch` handler for routing HTTP requests.
  - Handles queue and scheduled events.

### Routing Logic
- Uses the Hono framework to define routes for various API endpoints.
- Routes include:
  - `/v1` for API endpoints (e.g., inboxes, stats, billing).
  - `/webhooks` for handling incoming webhooks.
  - `/mcp` for Model Context Protocol interactions.
  - `/health` for health checks.

### Bindings
- **Bindings in `wrangler.jsonc`**:
  - `ASSETS`: Static assets from the `public/` directory.
  - `DATABASE_URL`: Secret for Neon Postgres connection.
  - `MAIL_QUEUE`: Queue for email processing.
  - `INBOX_WAIT`: Durable Object for managing inbox wait states.
  - `RATE_LIMIT`: KV namespace for rate limiting.
  - `RAW_MIME`: R2 bucket for storing raw MIME messages.
  - `AI`: Workers AI for embeddings and structured extraction.
  - Various secrets for email and authentication.

### Durable Objects
- **Class**: `InboxWait` located in `src/durable-objects/inbox-wait.ts`
  - Manages real-time waiting for messages via Server-Sent Events (SSE).

### Services
- Business logic is encapsulated in service files located in `src/services/`.
- Key services include:
  - `inbox.ts`: Inbox management (create, read, delete).
  - `outbound-mail.ts`: Sending and replying to emails.
  - `structured-extract.ts`: Extracting structured data from messages.

### Middleware
- **Auth Middleware**: Ensures API key authentication for protected routes.
- **Rate Limiting**: Applied to routes to control request rates.

### Cron Jobs
- Scheduled tasks for purging expired inboxes and audit events.

### Local Development
- Local development is facilitated using `npm run dev` to run the worker locally with environment variables from `.dev.vars`.

### Deployment
- Deployment is managed through GitHub Actions, triggered by pushes to the main branch, which runs tests and deploys the worker.

This structure allows for a modular and scalable approach to building the MailAgent application on Cloudflare Workers.
