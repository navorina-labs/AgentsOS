# MA14 (A)

## Answer

MCP (Model Context Protocol) integrates with MailAgent in the following ways:

- **Remote MCP Access**: 
  - MailAgent provides a remote MCP endpoint at `POST https://api.webmailagent.com/mcp` for clients to interact with.
  - Clients can use Bearer tokens for authentication.

- **MCP Tools**: 
  - MailAgent defines various MCP tools that can be used for operations such as creating inboxes, verifying signups, and extracting messages.
  - Tools include:
    - `mailagent_verify_signup`
    - `mailagent_create_inbox`
    - `mailagent_wait_and_extract`
    - `mailagent_list_inboxes`
    - `mailagent_send_message`
    - And more.

- **Session Management**: 
  - MCP supports session management through JWT tokens, allowing for stateless interactions without relying on KV storage for session data.

- **Progress Notifications**: 
  - MCP tools can emit progress notifications during long-running operations, allowing clients to receive updates on the status of their requests.

- **Integration with Agents**: 
  - MailAgent's MCP tools are designed to be used by AI agents, enabling them to perform tasks like email verification and message extraction seamlessly.

- **Documentation and Discovery**: 
  - MailAgent provides an API discovery endpoint (`GET /v1/agent`) that lists available MCP tools and their usage, along with documentation links.

This integration allows for a robust interaction model where agents can automate email-related tasks efficiently using the defined MCP tools and protocols.
