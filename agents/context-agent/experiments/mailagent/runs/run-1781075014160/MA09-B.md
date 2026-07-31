# MA09 (B)

## Answer

The critical tables in MailAgent are:

- **`inboxes`**: Core product table with fields like `id`, `address`, `expires_at`, etc.
- **`messages`**: Contains email content with fields such as `id`, `inbox_id`, `from_addr`, etc.
- **`teams`**: Manages multi-tenant authentication with fields like `plan` and `Stripe customer/subscription`.
- **`api_keys`**: Stores API keys with fields like `key_hash` and `key_hint`.
- **`custom_domains`**: Holds verified domains for inbox addresses.
- **`message_attachments`**: Contains metadata for attachments.
- **`callback_deliveries`**: Logs QA callback audits.
- **`message_search`**: Supports full-text and vector embeddings for search.
- **`audit_events`**: Maintains a team audit trail.
- **`agent_run_sessions`**: Tracks multi-step agent state by runId.
- **`team_dedicated_resend`**: Manages enterprise per-team Resend credentials.
