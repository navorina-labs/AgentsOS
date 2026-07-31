# MA06 (B)

## Answer

### Inbox Creation Process

1. **Request**: 
   - Use `POST /v1/inboxes` or `MCP mailagent_create_inbox` to create an inbox.
   - Request body can include parameters like `ttlMinutes`, `allowedSenders`, `label`, `callbackUrl`, `username`, and `domainId`.

2. **Quota Check**:
   - The system checks if the active inbox count for the team or API key hint exceeds the allowed limit using `checkInboxQuota()`.
   - If the limit is reached, a `429 inbox_limit_reached` error is returned.

3. **Allowed Senders Normalization**:
   - The `allowedSenders` are normalized using `normalizeAllowedSenders()`.

4. **Inbox ID Generation**:
   - A unique ID is generated using `nanoid(12)`.

5. **Domain Handling**:
   - If a `domainId` is provided, the system verifies the domain belongs to the team and is verified.
   - If valid, the inbox address is created as `{username}@{domain.name}`; otherwise, an error is returned.
   - If no `domainId` is provided, the address defaults to `inbox-{id}@{INBOX_DOMAIN}`.

6. **Expiration Time**:
   - The expiration time (`expiresAt`) is calculated based on the current time and the specified `ttlMinutes`.

7. **Database Insertion**:
   - The inbox is inserted into the database with fields like `api_key_hint`, `callback_url`, and `domain_id`.

8. **Response**:
   - On successful creation, a `201` response is returned with the inbox details, including `id` and `address`.

### Error Handling
- Various errors can occur during creation, such as:
  - `invalid_callback_url` (400)
  - `inbox_limit_reached` (429)
  - `domain_not_found` (404)
  - `domain_not_verified` (400)
  - `username_requires_domain` (400)
  - `label_required` (403)
  - `label_prefix_mismatch` (403)
  - `scope_read_only` (403)
