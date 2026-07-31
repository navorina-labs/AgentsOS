# MA06 (B)

## Answer

### Inbox Creation Process

1. **Endpoint**: 
   - `POST /v1/inboxes` or `MCP mailagent_create_inbox`.

2. **Request Body**: 
   - Optional parameters include:
     - `ttlMinutes`: Duration before expiration (default 30, max 1440).
     - `service`, `expectFrom`, `allowedSenders`, `label`, `callbackUrl`, `username`, `domainId`.

3. **Key Steps in `createInbox()`**:
   - Determine `ttl` from request or default.
   - Normalize `allowedSenders`.
   - Generate a unique `id` using `nanoid(12)`.
   - **Custom Domain Handling**:
     - If `domainId` is provided, validate it belongs to the team and is verified.
     - Construct the inbox address using the provided `username` and domain.
   - **Default Handling**:
     - If no `domainId`, create a default address format.
   - Set `expiresAt` based on the current time and `ttl`.
   - Insert the new inbox record into the database, including `api_key_hint`, `callback_url`, and `domain_id`.

4. **Error Handling**:
   - Various errors can occur, such as:
     - `invalid_callback_url`: If the callback URL is invalid.
     - `inbox_limit_reached`: If the maximum number of active inboxes is exceeded.
     - `domain_not_found` or `domain_not_verified`: If the domain is not valid or verified.
     - `username_requires_domain`: If a username is provided without a domain ID.
     - `label_required` or `label_prefix_mismatch`: If scoped key constraints are violated.

5. **Response**:
   - On success, returns a 201 status with the created inbox details (id, address).

This process allows for the creation of temporary inboxes that can be used for various purposes, such as verification flows.
