# MA06 (C)

## Answer

Inbox creation in the MailAgent project involves the following steps:

1. **API Endpoint**: The creation process is handled via the POST request to the `/` endpoint in the `src/routes/inboxes.ts` file.

2. **Request Body**: The request expects a JSON body with optional parameters:
   - `ttlMinutes`: Time-to-live for the inbox.
   - `expectFrom`: Allowed sender(s).
   - `allowedSenders`: List of allowed senders.
   - `label`: Label for the inbox.
   - `callbackUrl`: URL for callbacks.
   - `notifyEmail`: Email for notifications.
   - `notifyMode`: Mode for notifications.
   - `username`: Username for the inbox.
   - `domainId`: Domain ID for the inbox.

3. **Validation**:
   - The request body is parsed and validated.
   - Checks are performed to ensure the user has permission to create an inbox (using `scopeWriteDenied`).
   - The quota for inbox creation is checked (using `checkInboxQuota`).
   - The label for the inbox is validated (using `scopeLabelForCreate`).

4. **Inbox Creation**:
   - If all validations pass, the `createInbox` function from `src/services/inbox.ts` is called.
   - This function generates a unique inbox address, sets its expiration time, and stores it in the database.

5. **Response**:
   - If the inbox is created successfully, a JSON response is returned with the inbox details.
   - If there are errors (e.g., domain not found, domain not verified), appropriate error messages are returned.

6. **Cleanup**: Optionally, if the inbox is set to be deleted after use, it will be removed after the specified operations are completed.

This process ensures that inboxes are created securely and with the necessary validations in place.
