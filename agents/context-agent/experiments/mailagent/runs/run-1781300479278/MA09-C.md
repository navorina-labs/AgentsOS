# MA09 (C)

## Answer

The critical database tables in MailAgent include:

- **inboxes**: Stores temporary inboxes with attributes like expiration time, labels, and callback URLs.
- **messages**: Contains inbound messages, including details like OTP, links, provider IDs, and timestamps.
- **message_attachments**: Holds attachments related to messages, including filenames and sizes.
- **api_keys**: Manages API keys with associated scopes and team bindings.
- **teams**: Stores information about multi-tenant teams, including their plans and subscriptions.

These tables are essential for managing inboxes, messages, and user authentication within the MailAgent system.
