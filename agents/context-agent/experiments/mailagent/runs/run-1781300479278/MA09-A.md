# MA09 (A)

## Answer

The critical database tables in MailAgent are:

- **inboxes**
  - Stores temporary inboxes with fields like `id`, `address`, `expires_at`, `created_at`, and `allowed_senders`.

- **messages**
  - Contains email messages with fields such as `id`, `inbox_id`, `provider_id`, `from_addr`, `subject`, `otp`, and `received_at`.

- **callback_deliveries**
  - Logs callback notifications sent to `callbackUrl` with fields like `id`, `inbox_id`, `message_id`, `callback_url`, `status_code`, and `ok`.

- **teams**
  - Manages team information, including `id`, `name`, `plan`, and `stripe_customer_id`.

- **api_keys**
  - Stores API keys associated with teams, including `id`, `team_id`, `key_hash`, and `label`.

- **oidc_identities**
  - Records OIDC login information, linking `team_id` with `issuer` and `sub`.

- **message_attachments**
  - Manages attachments related to messages, with fields like `id`, `message_id`, `filename`, and `size_bytes`.

These tables are essential for the functionality of MailAgent, including inbox management, message handling, team management, and callback processing.
