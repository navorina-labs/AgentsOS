# MA14 (C)

## Answer

MCP (Model Context Protocol) integrates with MailAgent in the following ways:

- **Remote MCP Support**: MailAgent provides a remote MCP interface that allows clients to interact with it using JSON-RPC and streamable HTTP (SSE sessions).
  
- **MCP Tools**: MailAgent defines several MCP tools that can be used for various operations, such as:
  - `mailagent_verify_signup`: Verifies email signups.
  - `mailagent_create_inbox`: Creates temporary inboxes for email verification.
  - `mailagent_wait_and_extract`: Waits for an email and extracts information from it.
  
- **Authentication**: MCP requires authentication via API keys or OAuth tokens, ensuring secure access to its features.

- **Session Management**: MailAgent manages MCP sessions using JWTs or a key-value store, allowing for stateless or stateful session handling.

- **Documentation and Discovery**: MailAgent provides endpoints for discovering available MCP tools and their usage, along with detailed documentation for integration.

- **Integration with Other Services**: MailAgent can be used in conjunction with other services (like Resend for email handling) through the MCP tools, enabling a seamless workflow for email verification and related tasks.

For more detailed information, refer to the specific sections in the MailAgent documentation regarding MCP integration and tools.
