# MA09 (A)

## Answer

The critical database tables in MailAgent are:

- **inboxes**
  - Stores temporary inboxes with fields like `id`, `address`, `expires_at`, `created_at`, and `allowed_senders`.

- **messages**
  - Contains email messages with fields such as `id`, `inbox_id`, `provider_id`, `from_addr`, `subject`, `otp`, `links_json`, and `received_at`.

- **callback_deliveries**
  - Logs callback notifications for webhook delivery with fields like `id`, `inbox_id`, `callback_url`, `status_code`, `ok`, and `created_at`.

- **teams**
  - Manages team information with fields like `id`, `name`, `plan`, and `created_at`.

- **api_keys**
  - Stores API keys associated with teams, including `id`, `team_id`, `key_hash`, and `created_at`.

- **oidc_identities**
  - Records OIDC login identities linked to teams with fields like `id`, `team_id`, `issuer`, and `sub`.

- **message_attachments**
  - Manages metadata for message attachments with fields like `id`, `message_id`, `filename`, and `size_bytes`.

- **agent_run_sessions**
  - Tracks multi-step agent run states with fields like `run_id`, `owner_key`, `state`, and `steps`.

These tables are essential for the functionality of MailAgent, including inbox management, message processing, team management, and API key handling.
