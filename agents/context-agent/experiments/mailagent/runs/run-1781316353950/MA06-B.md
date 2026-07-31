# MA06 (B)

## Answer

### Inbox Creation Process

1. **Request**: 
   - An agent sends a `POST` request to `/v1/inboxes` or uses the MCP method `mailagent_create_inbox`.

2. **Input Parameters**:
   - The request body can include:
     - `ttlMinutes` (default 30, max 1440)
     - `service`, `expectFrom`, `allowedSenders`, `label`, `callbackUrl`, `username`, `domainId`
     - For `open` requests: `subjectContains`, `messageIndex`, `timeoutSeconds`, `deleteAfter`

3. **Logic Execution**:
   - The function `createInbox()` is called with the provided options.
   - **TTL Resolution**: Determines the expiration time based on `ttlMinutes`.
   - **Allowed Senders**: Normalizes the `allowedSenders` or `expectFrom`.
   - **ID Generation**: Creates a unique ID using `nanoid(12)`.
   - **Domain Handling**:
     - If `domainId` is provided, it checks if the domain belongs to the team and is verified.
     - If valid, constructs the inbox address using the provided `username` and domain.
     - If no `domainId`, it defaults to a standard inbox address format.
   - **Expiration Time**: Sets `expiresAt` based on the current time plus the TTL.
   - **Database Insertion**: Inserts the new inbox record into the `inboxes` table, including `api_key_hint`, `callback_url`, and `domain_id`.

4. **Error Handling**:
   - Various errors can occur during creation, such as:
     - `invalid_callback_url`
     - `inbox_limit_reached`
     - `domain_not_found`
     - `domain_not_verified`
     - `username_requires_domain`
     - `label_required`
     - `label_prefix_mismatch`
     - `scope_read_only`

5. **Response**:
   - On successful creation, the response includes a 201 status with the new inbox's `id` and `address`.
