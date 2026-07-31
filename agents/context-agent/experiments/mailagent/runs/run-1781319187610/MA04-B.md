# MA04 (B)

## Answer

MailAgent is a tool designed to provide temporary inboxes for AI agents and QA/E2E testing. It allows for programmatic creation of email addresses, waiting for incoming messages, and extracting OTPs or magic links without manual intervention.

### Target Users:
- **AI Agents**: Such as Codex and other coding agents that automate email verification processes.
- **QA Engineers**: Who require stable and isolated inboxes for testing signup and login flows in CI environments.
- **Integration Developers**: Building internal QA platforms or agent orchestrators.
- **Team Admins**: Managing API keys, billing, and custom domains for organizations.
- **Operators**: Human users who handle one-time secrets and deployments, but are not daily users of MailAgent. 

### Key Features:
- Programmatic access to create and manage temporary inboxes.
- Built-in support for extracting verification codes and links.
- Designed to avoid issues associated with shared inboxes in CI environments.
