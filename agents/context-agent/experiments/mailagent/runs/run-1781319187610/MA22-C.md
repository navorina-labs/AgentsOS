# MA22 (C)

## Answer

- Business logic in the Worker is primarily located in the **services layer**.
- Services contain operations related to:
  - Database interactions (e.g., `src/db/client.ts`)
  - External APIs (e.g., Resend, Stripe)
  - Email processing (e.g., `src/services/inbox.ts`, `src/services/message-raw.ts`)
  - Utility functions (e.g., `src/lib/*.ts`)
- The **routes** (e.g., `src/routes/*.ts`) are thin and mainly handle HTTP requests, authentication, and validation, delegating the core logic to the services.
- The **MCP tools** (in `src/mcp/handlers.ts`) also directly invoke services without HTTP loopback, indicating a separation of concerns.
