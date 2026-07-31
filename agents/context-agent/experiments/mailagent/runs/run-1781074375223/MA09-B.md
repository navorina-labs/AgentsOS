# MA09 (B)

## Answer

The critical tables in MailAgent are:

- **`inboxes`**: Core product table with fields like `id`, `address`, `expires_at`, etc.
- **`messages`**: Contains email content with fields such as `id`, `inbox_id`, `from_addr`, etc.
- **`teams`**: Manages multi-tenant authentication with plan and subscription details.
- **`api_keys`**: Stores API key information with unique key hashes and scopes.
- **`custom_domains`**: Holds verified domains for inbox addresses.
- **`message_attachments`**: Metadata for attachments and R2 keys.
- **`callback_deliveries`**: QA callback audit log.
- **`message_search`**: Full-text search and vector embeddings.
- **`audit_events`**: Audit trail for team activities.
- **`agent_run_sessions`**: Tracks multi-step agent state by runId.
- **`team_dedicated_resend`**: Stores enterprise per-team Resend credentials.
