# MA14 (A)

## Answer

MCP (Model Context Protocol) integrates with MailAgent in the following ways:

- **Remote MCP Access**: 
  - MailAgent provides a remote MCP endpoint at `https://api.webmailagent.com/mcp` for clients to interact with.
  - Clients can use Bearer tokens for authentication.

- **MCP Tools**: 
  - MailAgent defines various MCP tools that can be accessed via the MCP endpoint, such as:
    - `mailagent_verify_signup`
    - `mailagent_create_inbox`
    - `mailagent_wait_and_extract`
    - `mailagent_list_inboxes`
    - `mailagent_send_message`
    - `mailagent_extract_verification`
  - Each tool has a specific purpose, such as creating inboxes, verifying signups, and extracting messages.

- **Session Management**: 
  - MCP supports session management through JWTs (JSON Web Tokens) for stateless authentication, allowing for secure and efficient communication.

- **Progress Notifications**: 
  - MCP tools can emit progress notifications during long-running operations, allowing clients to receive updates on the status of their requests.

- **Integration with Agents**: 
  - MailAgent's MCP tools are designed for coding agents such as Codex to facilitate email verification and related tasks.

- **Documentation and Discovery**: 
  - MailAgent provides an API discovery endpoint (`GET /v1/agent`) that lists available MCP tools and their usage, along with documentation links.

This integration allows for seamless interaction between MailAgent and various clients using the MCP framework, enabling functionalities like email verification and inbox management.
