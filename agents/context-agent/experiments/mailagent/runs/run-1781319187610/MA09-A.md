# MA09 (A)

## Answer

The critical database tables in MailAgent are:

- **inboxes**
  - Stores temporary inboxes with fields like `id`, `address`, `expires_at`, `created_at`, `label`, `callback_url`, `notify_email`, and `notify_mode`.

- **messages**
  - Contains email messages associated with inboxes, including fields such as `id`, `inbox_id`, `provider_id`, `from_addr`, `subject`, `text_preview`, `html_preview`, `otp`, `links_json`, and `received_at`.

- **teams**
  - Manages team information, including `id`, `name`, `plan`, and other billing-related fields.

- **api_keys**
  - Stores API keys associated with teams, including `id`, `team_id`, `key_hash`, `key_hint`, `label`, and scope fields.

- **oidc_identities**
  - Records OIDC login information for teams, including `id`, `team_id`, `issuer`, `sub`, and `email`.

- **callback_deliveries**
  - Logs callback notifications sent to webhooks, with fields like `id`, `inbox_id`, `message_id`, `callback_url`, `status_code`, `ok`, `error_text`, and `duration_ms`.

- **message_attachments**
  - Stores metadata for attachments associated with messages, including `id`, `message_id`, `provider_id`, `filename`, `content_type`, `size_bytes`, and `r2_key`.

These tables are essential for the functionality of MailAgent, including managing inboxes, processing messages, handling team and API key management, and logging callback deliveries.
