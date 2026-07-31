# MA09 (A)

## Answer

The critical database tables in MailAgent are:

- **inboxes**
  - Stores temporary inboxes with fields like `id`, `address`, `expires_at`, `created_at`, `allowed_senders`, `label`, `callback_url`, `notify_email`, and `notify_mode`.

- **messages**
  - Contains email messages with fields such as `id`, `inbox_id`, `provider_id`, `from_addr`, `subject`, `text_preview`, `html_preview`, `otp`, `links_json`, and `received_at`.

- **callback_deliveries**
  - Logs callback notifications sent to `callbackUrl` with fields like `id`, `inbox_id`, `message_id`, `callback_url`, `status_code`, `ok`, `error_text`, `duration_ms`, and `created_at`.

- **teams**
  - Manages team information with fields like `id`, `name`, `plan`, `stripe_customer_id`, `stripe_subscription_id`, and `created_at`.

- **api_keys**
  - Stores API keys associated with teams, including `id`, `team_id`, `key_hash`, `key_hint`, `label`, and `created_at`.

- **oidc_identities**
  - Records OIDC login identities with fields such as `id`, `team_id`, `issuer`, `sub`, `email`, and `created_at`.

- **message_attachments**
  - Manages attachments related to messages with fields like `id`, `message_id`, `provider_id`, `filename`, `content_type`, `size_bytes`, `content_disposition`, `content_id`, and `r2_key`.

These tables are essential for the functionality of MailAgent, including managing inboxes, processing messages, handling callbacks, and supporting team and API key management.
