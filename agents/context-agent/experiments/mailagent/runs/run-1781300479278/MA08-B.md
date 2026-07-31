# MA08 (B)

## Answer

The Cloudflare Worker for the MailAgent project is structured as follows:

- **Entry Point:**
  - `src/index.ts` serves as the main entry point and exports the worker's handlers.

- **Handlers:**
  - **`fetch`**: Implemented in `src/index.ts` as `handleFetch`.
  - **`queue`**: Implemented in `src/queue/consumer.ts` as `handleQueueBatch`.
  - **`scheduled`**: Inline in `src/index.ts`, calls `purgeExpired` and `purgeExpiredAuditEvents`.

- **Routing:**
  - Uses Hono framework to mount 16 route modules.
  - `handleFetch` delegates API paths to the Hono app.

- **Layer Separation:**
  - **Entry Layer**: `src/index.ts` handles routing for fetch, queue, and scheduled tasks.
  - **Routes Layer**: Located in `src/routes/*.ts`, responsible for HTTP middleware, parsing, and response formatting.
  - **Services Layer**: Located in `src/services/*.ts`, contains business logic, database interactions, and external API calls.
  - **Lib Layer**: Located in `src/lib/*.ts`, includes shared utilities and authentication.
  - **MCP Layer**: Located in `src/mcp/*.ts`, handles tool dispatching in-process.
  - **Queue Layer**: Located in `src/queue/*.ts`, manages batch processing of messages.
  - **Database Layer**: Located in `src/db/client.ts`, interfaces with the Neon SQL client.
  - **Durable Objects Layer**: Located in `src/durable-objects/*.ts`, manages stateful server-sent events (SSE).

- **Bindings:**
  - Defined in `src/env.ts`, includes all worker bindings and secrets.

- **Durable Object:**
  - `InboxWait` class is defined in `src/durable-objects/inbox-wait.ts` and is used for managing SSE subscriptions.

This structure allows for clear separation of concerns, making the worker modular and maintainable.
