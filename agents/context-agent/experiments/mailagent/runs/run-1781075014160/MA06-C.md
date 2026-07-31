# MA06 (C)

## Answer

Inbox creation in the MailAgent project involves the following steps:

1. **API Endpoint**: The creation is handled via the POST request to the `/v1/inboxes` endpoint in `src/routes/inboxes.ts`.

2. **Request Body**: The request body can include parameters such as:
   - `ttlMinutes`: Time-to-live for the inbox.
   - `expectFrom`: Allowed sender(s).
   - `allowedSenders`: List of allowed senders.
   - `label`: Optional label for the inbox.
   - `callbackUrl`: URL for callbacks.
   - `username`: Username for the inbox.
   - `domainId`: Domain ID for the inbox.

3. **Validation**:
   - The API checks if the user has permission to create an inbox using `scopeWriteDenied`.
   - It validates the quota for inbox creation with `checkInboxQuota`.
   - It checks if the label is valid using `scopeLabelForCreate`.

4. **Inbox Creation**:
   - If all validations pass, the `createInbox` function from `src/services/inbox.ts` is called.
   - This function generates a unique ID for the inbox, constructs the email address, and stores the inbox details in the database.

5. **Response**:
   - If successful, the API responds with the created inbox's ID and details.
   - If there are errors (e.g., domain not found, username requires domain), appropriate error messages are returned.

6. **Audit Logging**: The creation action is logged using `auditRoute` to track the creation of the inbox.

This process ensures that inboxes are created securely and with the necessary validations in place.
