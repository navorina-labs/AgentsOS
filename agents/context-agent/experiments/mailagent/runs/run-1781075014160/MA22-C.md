# MA22 (C)

## Answer

The business logic in the Worker is primarily located in the following directories and files:

### Routes (HTTP layer)
- **`src/routes/`**: Contains thin handlers that manage authentication, validation, and service calls.
  - `inboxes.ts`: Inbox CRUD operations, waiting for messages, and extraction.
  - `webhooks.ts`: Handles incoming webhooks from Resend and Stripe.
  - `agent.ts`: Manages agent-related operations, including verification and running sessions.
  - `mcp-http.ts`: Handles remote MCP JSON-RPC requests.
  - `oauth.ts`: Manages OAuth-related routes.
  - `team.ts`: Handles team management, API keys, and dedicated Resend configurations.
  - `domains.ts`: Manages custom domain lifecycle.
  - `billing.ts`: Integrates with Stripe for billing operations.
  - `console.ts`: Provides dashboard API functionalities.
  - `audit.ts`: Manages audit log reading.

### Services (business logic)
- **`src/services/`**: Contains core business logic implementations.
  - `inbox.ts`: Functions for creating, reading, deleting, and listing inboxes.
  - `resend-mail.ts`: Processes inbound emails.
  - `extract.ts`: Extracts OTPs and links from messages.
  - `wait.ts`: Implements waiting logic for messages.
  - `simulate-inbound.ts`: Simulates inbound messages for testing.
  - `outbound-mail.ts`: Manages sending and replying to emails.
  - `callback.ts`: Handles webhook callbacks.
  - `message-verify.ts`: Manages message verification processes.
  - `message-search.ts`: Implements search functionalities for messages.
  - `structured-extract.ts`: Extracts structured data from messages.

### Libraries (shared utilities)
- **`src/lib/`**: Contains utility functions and shared logic used across services and routes.
  - Includes authentication, rate limiting, service presets, and more.

### Durable Objects
- **`src/durable-objects/`**: Contains stateful logic for managing real-time subscriptions and events, such as `InboxWait`.

### MCP (Model Context Protocol)
- **`src/mcp/`**: Contains tools and handlers for executing MCP-related operations.

This structure allows for clear separation of concerns, with routes handling HTTP requests, services implementing core business logic, and libraries providing shared utilities.
