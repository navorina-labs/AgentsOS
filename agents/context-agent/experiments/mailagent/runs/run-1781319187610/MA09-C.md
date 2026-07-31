# MA09 (C)

## Answer

The critical database tables in MailAgent include:

- **inboxes**: Stores temporary inboxes with attributes like expiration time and labels.
- **messages**: Contains details of inbound and outbound messages, including OTPs and links.
- **message_attachments**: Stores attachments related to messages.
- **api_keys**: Manages API keys and their associated permissions.
- **teams**: Handles multi-tenant information, including plans and subscriptions.

These tables are essential for managing inboxes, messages, and user authentication within the MailAgent system.
