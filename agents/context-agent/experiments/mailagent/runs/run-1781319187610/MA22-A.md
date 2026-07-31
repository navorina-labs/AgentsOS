# MA22 (A)

## Answer

The business logic in the Worker is primarily located in the following areas:

- **Services**: Functions that handle specific operations, such as:
  - `src/services/inbox`: Manages inbox creation, retrieval, and deletion.
  - `src/services/message-raw`: Handles raw message processing.
  - `src/services/message-attachments`: Manages attachment metadata and retrieval.
  - `src/services/agent-verify`: Contains logic for verifying signups and handling OTPs.
  - `src/services/audit-log`: Manages audit logging for actions taken by the API.

- **MCP Handlers**: The `src/mcp/handlers.ts` file contains the logic for executing MCP tools, including:
  - Handling requests for creating inboxes, verifying signups, and waiting for messages.
  - Validating input and managing session states.

- **Route Handlers**: The route files (e.g., `src/routes/inboxes.ts`, `src/routes/agent.ts`, etc.) define the API endpoints and contain logic for processing requests, validating inputs, and returning responses.

- **Utility Functions**: Various utility functions in `src/lib/` handle tasks such as:
  - Validating email syntax.
  - Managing API key scopes.
  - Handling rate limits and security checks.

These components work together to implement the core functionality of the MailAgent, including inbox management, email verification, and integration with external services.
