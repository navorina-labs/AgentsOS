# MA14 (C)

## Answer

The integration of MCP (Model Context Protocol) with MailAgent involves several components and functionalities:

- **Remote MCP**: MailAgent supports a remote MCP interface that allows for JSON-RPC and streamable HTTP (SSE sessions).
  
- **MCP Tools**: MailAgent provides various tools for MCP, such as:
  - `mailagent_verify_signup`: Waits for verification emails and returns actions (OTP or magic link).
  - `mailagent_create_inbox`: Creates a temporary inbox for email verification.
  - `mailagent_wait_and_extract`: Combines creating an inbox, waiting for a message, and extracting information in one call.

- **Authentication**: MCP requires authentication via API keys or OAuth tokens. The `requireMcpAuth` middleware checks for valid credentials.

- **Session Management**: MCP sessions can be managed using JWTs or legacy KV storage. Functions like `createMcpSession`, `validateMcpSession`, and `deleteMcpSession` handle session lifecycle.

- **Progress Notifications**: MCP tools can send progress notifications during operations, allowing clients to track the status of long-running tasks.

- **Documentation and Discovery**: MailAgent provides endpoints for discovering available MCP tools and their documentation, enhancing usability for developers.

- **Integration with Other Services**: MailAgent's MCP tools can interact with various services (e.g., email providers) to facilitate tasks like email verification and message extraction.

For detailed implementation, refer to the specific files and routes related to MCP in the MailAgent codebase, such as `src/routes/mcp-http.ts`, `src/mcp/handlers.ts`, and `src/mcp/manifest.ts`.
