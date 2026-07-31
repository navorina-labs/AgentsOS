# MA09 (C)

## Answer

The critical database tables in MailAgent are:

- **inboxes**
  - Columns: `id`, `address (UNIQUE)`, `expires_at`, `created_at`, `allowed_senders`, `label`, `callback_url`, `api_key_hint`, `domain_id`
  - Purpose: Core product functionality, managing temporary inboxes.

- **messages**
  - Columns: `id`, `inbox_id (FK CASCADE)`, `provider_id (UNIQUE)`, `from_addr`, `subject`, `text_preview`, `html_preview`, `otp`, `links_json`, `received_at`, `raw_r2_key`, `direction`, `thread_id`, `in_reply_to`, `to_addrs`, `rfc_message_id`
  - Purpose: Storing email content and metadata.

- **teams**
  - Purpose: Managing multi-tenant authentication, including plans and subscriptions.

- **api_keys**
  - Purpose: Storing API keys with unique identifiers and scopes.

- **custom_domains**
  - Purpose: Managing verified domains for inbox addresses.

- **message_attachments**
  - Purpose: Storing metadata for email attachments.

- **callback_deliveries**
  - Purpose: Logging QA callback events.

- **message_search**
  - Purpose: Full-text and vector embeddings for search functionality.

- **audit_events**
  - Purpose: Tracking team audit trails.

- **agent_run_sessions**
  - Purpose: Managing multi-step agent state by run ID.

- **team_dedicated_resend**
  - Purpose: Storing enterprise-specific Resend credentials for teams.
