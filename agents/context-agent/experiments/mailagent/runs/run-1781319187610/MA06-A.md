# MA06 (A)

## Answer

Inbox creation in the MailAgent project works as follows:

- **API Endpoint**: Use the `POST /v1/inboxes` endpoint to create an inbox.
- **Required Fields**:
  - `service`: Specifies the service preset (e.g., `github`, `auth0`).
  - `label`: Optional label for the inbox.
  - `ttlMinutes`: Optional time-to-live for the inbox in minutes.
  - `callbackUrl`: Optional URL for receiving notifications when a message is received.
  - `notifyEmail`: Optional email address for sending OTP summaries to a developer.
  - `notifyMode`: Specifies the mode for notifications (e.g., `verification`).
  - `username`: Local part for custom domain inbox (requires `domainId`).
  - `domainId`: ID of a verified custom domain.

- **Response**: The API returns the created inbox's details, including its address and expiration time.

- **Validation**: The request validates the `callbackUrl` and checks if the `label` adheres to the defined scope (if applicable).

- **Allowed Senders**: The `expectFrom` field can be used to specify allowed senders based on the service preset.

- **Error Handling**: If the creation fails, the API returns an error message indicating the reason (e.g., invalid callback URL or domain not verified).

- **Example Command**:
  ```bash
  curl -sS -X POST "$MAILAGENT_API_URL/v1/inboxes" \
    -H "Authorization: Bearer $MAILAGENT_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{"service":"auth0","label":"test-inbox"}'
  ```

This command creates an inbox for the specified service and returns the inbox details.
