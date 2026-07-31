# MA08 (C)

## Answer

The Cloudflare Worker for the MailAgent project is structured as follows:

### Entry Point
- **File:** `src/index.ts`
- **Handlers:**
  - `fetch`: Handles HTTP requests (API and static site).
  - `queue`: Processes asynchronous email ingestion from Resend webhooks.
  - `scheduled`: Executes hourly cron jobs for purging expired inboxes and audit retention.

### Routing
- Uses the **Hono** framework to define routes.
- Routes are organized into separate modules for different functionalities:
  - **API Routes:** `/v1/inboxes`, `/v1/stats`, `/v1/me`, etc.
  - **Webhook Routes:** `/webhooks`.
  - **MCP Routes:** `/mcp`.

### Layers
- **Routes Layer:** Contains HTTP middleware, request parsing, and response formatting.
- **Services Layer:** Contains business logic, database interactions, and external API calls.
- **Library Layer:** Contains shared utilities, authentication, and scope management.
- **Durable Objects:** Used for managing stateful connections (e.g., `InboxWait`).

### Environment Bindings
- Defined in `src/env.ts`, includes:
  - `ASSETS`: Static assets.
  - `DATABASE_URL`: Connection string for Neon Postgres.
  - `RESEND_API_KEY`: API key for Resend service.
  - `MAIL_QUEUE`: Queue for processing emails.
  - `INBOX_WAIT`: Durable Object namespace for managing inbox wait states.

### Key Components
- **Durable Objects:** For managing real-time connections and stateful interactions.
- **Queues:** For handling asynchronous email processing.
- **Cron Jobs:** For scheduled tasks like purging expired inboxes.

### Overall Structure
- The Worker is designed to separate concerns, with thin routes delegating to services that encapsulate the core business logic, ensuring maintainability and scalability.
