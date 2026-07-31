# MA09 (A)

## Answer

The critical database tables in MailAgent are:

- **inboxes**
  - Stores temporary inboxes with fields like `id`, `address`, `expires_at`, `created_at`, `allowed_senders`, `label`, and `callback_url`.

- **messages**
  - Contains email messages with fields such as `id`, `inbox_id`, `provider_id`, `from_addr`, `subject`, `text_preview`, `html_preview`, `otp`, `links_json`, and `received_at`.

- **teams**
  - Manages team information with fields like `id`, `name`, `plan`, `stripe_customer_id`, and `created_at`.

- **api_keys**
  - Stores API keys associated with teams, including `id`, `team_id`, `key_hash`, `key_hint`, and `label`.

- **oidc_identities**
  - Records OIDC login information with fields such as `id`, `team_id`, `issuer`, `sub`, and `email`.

- **callback_deliveries**
  - Logs callback notifications with fields like `id`, `inbox_id`, `message_id`, `callback_url`, `status_code`, and `created_at`.

- **message_attachments**
  - Manages metadata for message attachments with fields like `id`, `message_id`, `provider_id`, `filename`, `content_type`, and `size_bytes`.

- **audit_events**
  - Tracks audit logs for actions performed by teams or API keys, including `id`, `team_id`, `action`, `resource_type`, and `created_at`.

These tables are essential for the functionality of MailAgent, including inbox management, message handling, team administration, and auditing.
