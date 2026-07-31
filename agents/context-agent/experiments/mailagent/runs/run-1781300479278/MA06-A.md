# MA06 (A)

## Answer

Inbox creation in the MailAgent project works as follows:

- **API Endpoint**: Use the `POST /v1/inboxes` endpoint to create an inbox.
- **Required Fields**:
  - `service`: Specifies the service preset (e.g., `github`, `auth0`).
  - `label`: Optional label for the inbox.
  - `ttlMinutes`: Optional time-to-live for the inbox in minutes.
  - `callbackUrl`: Optional URL for receiving notifications when a message is received.
  - `notifyEmail`: Optional email address for sending OTP summaries to a developer's real inbox.
  - `notifyMode`: Specifies the mode for notifications (e.g., `verification`).
  - `username`: Optional local part for custom domain inboxes (requires `domainId`).
  - `domainId`: Optional verified custom domain ID.

- **Response**: The API returns the created inbox's details, including its ID and address.

- **Validation**: The request is validated to ensure that the `callbackUrl` is a valid HTTPS URL and that the `notifyEmail` is not a disposable email address.

- **Allowed Senders**: The `expectFrom` field can be used to specify allowed senders based on the service preset.

- **Error Handling**: If there are issues (e.g., invalid callback URL, domain not verified), appropriate error messages are returned.

- **Example Command**:
  ```bash
  curl -sS -X POST "$MAILAGENT_API_URL/v1/inboxes" \
    -H "Authorization: Bearer $MAILAGENT_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{"service":"auth0","label":"test-inbox"}'
  ```

This process allows for the creation of temporary inboxes tailored for specific services, facilitating email verification and other related tasks.
