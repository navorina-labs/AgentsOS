# MA22 (C)

## Answer

- Business logic in the Worker is primarily located in the **services** layer, specifically within files in the `src/services/` directory.
- The routes in `src/routes/*.ts` are thin and mainly handle HTTP requests, authentication, and validation.
- The services contain the core operations related to database interactions, external API calls, and other business functionalities.
- Examples of service files include:
  - `src/services/inbox.ts`
  - `src/services/message-raw.ts`
  - `src/services/team-resend.ts`
  - `src/services/callback-log.ts`
- The **MCP (MailAgent Control Plane)** tools in `src/mcp/handlers.ts` also execute business logic directly without HTTP loopback, interacting with services directly.
