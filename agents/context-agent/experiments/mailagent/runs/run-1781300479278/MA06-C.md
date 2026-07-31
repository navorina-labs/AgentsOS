# MA06 (C)

## Answer

Inbox creation in the MailAgent project involves the following steps:

1. **API Endpoint**: The inbox is created via a POST request to the `/` endpoint of the `inboxRoutes`.

2. **Request Body**: The request body can include various parameters:
   - `ttlMinutes`: Time-to-live for the inbox.
   - `expectFrom`: Allowed sender(s).
   - `allowedSenders`: List of allowed senders.
   - `label`: Optional label for the inbox.
   - `callbackUrl`: URL for callbacks.
   - `notifyEmail`: Email for notifications.
   - `notifyMode`: Mode for notifications.
   - `username`: Username for the inbox.
   - `domainId`: ID of the domain associated with the inbox.

3. **Validation**:
   - The request is validated for write permissions using `scopeWriteDenied`.
   - The body is parsed and validated for required fields.
   - Quota checks are performed to ensure the user has not exceeded their inbox limit.

4. **Domain Verification**:
   - If a `domainId` is provided, the domain is checked for existence and verification status.
   - If the domain is not verified, an error is returned.

5. **Inbox Creation**:
   - If all validations pass, the inbox is created using the `createInbox` function, which:
     - Generates a unique inbox address.
     - Sets the expiration time based on `ttlMinutes`.
     - Inserts the inbox details into the database.

6. **Response**:
   - If the inbox is created successfully, a response is returned with the inbox details, including its ID and address.
   - If there are errors during creation (e.g., domain not found, domain not verified), appropriate error messages are returned.

This process ensures that inboxes are created securely and with the necessary validations in place.
