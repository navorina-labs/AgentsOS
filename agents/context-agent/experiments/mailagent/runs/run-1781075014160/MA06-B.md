# MA06 (B)

## Answer

Inbox creation works as follows:

- **Methods:**
  - `POST /v1/inboxes`: Full create.
  - `POST /v1/inboxes/open`: Create + wait + extract + optional delete.
  - MCP: `mailagent_create_inbox` with the same options.

- **Body Options:**
  - `ttlMinutes`: Duration before expiration (default 30 minutes, max 1440 minutes).
  - `service`: Resolves `expectFrom` via presets.
  - `expectFrom` / `allowedSenders`: Sender allowlist.
  - `label`: Up to 128 characters for QA tracing.
  - `callbackUrl`: HTTPS webhook for message notifications.
  - `username` + `domainId`: Custom domain (must be verified).

- **Errors:**
  - `domain_not_found`
  - `domain_not_verified`
  - `username_requires_domain`
  - `429 inbox_limit_reached`

- **Quota:**
  - Managed by `countActiveInboxesForTeam/Hint` vs `PLAN_LIMITS[plan].maxActiveInboxes`.
