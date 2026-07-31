# MA23 (A)

## Answer

The sender allowlist in the MailAgent project works as follows:

- **Purpose**: It restricts which email addresses can send messages to the temporary inboxes created by MailAgent.
- **Configuration**:
  - The allowlist can be set using the `service` field when creating an inbox, which automatically applies a preset of allowed senders for common services (e.g., GitHub, Google).
  - Alternatively, you can specify custom allowed senders using the `expectFrom` or `allowedSenders` fields in the inbox creation request.
- **Behavior**:
  - If the inbox is created with a specified `service`, only emails from that service's domains are accepted.
  - If `expectFrom` or `allowedSenders` is provided, only emails from those specified addresses or domains will be accepted.
  - Emails from any other domains will not be stored in the inbox.
- **Implementation**: The function `isSenderAllowed` checks the `from` address of incoming emails against the configured allowlist. If the sender is not in the allowlist, the email is dropped and not stored.

This mechanism helps prevent unwanted emails from cluttering the inboxes and ensures that only relevant messages are processed.
