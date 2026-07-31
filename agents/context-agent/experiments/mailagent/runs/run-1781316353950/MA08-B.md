# MA08 (B)

## Answer

The Cloudflare Worker for the MailAgent project is structured as follows:

- **Entry Point**: 
  - `src/index.ts` serves as the main entry point for the Worker.

- **Handlers**:
  - **`fetch`**: Managed by `handleFetch` in `src/index.ts`.
  - **`queue`**: Managed by `handleQueueBatch` in `src/queue/consumer.ts`.
  - **`scheduled`**: Inline in `src/index.ts`, calls `purgeExpired` and `purgeExpiredAuditEvents`.

- **Routing**:
  - Uses Hono framework to mount 16 route modules.
  - `handleFetch` delegates API paths to the Hono app.

- **Layer Separation**:
  - **Entry**: `src/index.ts` - routing for fetch, queue, and scheduled tasks.
  - **Routes**: `src/routes/*.ts` - handles HTTP requests, middleware, and response formatting.
  - **Services**: `src/services/*.ts` - contains business logic, database interactions, and external API calls.
  - **Lib**: `src/lib/*.ts` - shared utilities and helpers.
  - **MCP**: `src/mcp/*.ts` - in-process tool dispatching.
  - **Queue**: `src/queue/*.ts` - batch processing of queued messages.
  - **DB**: `src/db/client.ts` - database client for Neon SQL.
  - **Durable Objects**: `src/durable-objects/*.ts` - stateful objects for managing subscriptions.

- **Durable Object**:
  - `InboxWait` class is exported from `src/durable-objects/inbox-wait.ts` and used for managing SSE subscriptions.

- **Environment Bindings**:
  - Defined in `src/env.ts`, includes various required and optional bindings for services, databases, and APIs.

This structure allows for clear separation of concerns, with distinct layers for routing, business logic, and data management.
