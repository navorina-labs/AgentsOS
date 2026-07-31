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
  - `username`: Optional local part for custom domain inboxes (requires `domainId`).
  - `domainId`: Optional verified custom domain ID.

- **Response**: The API returns the created inbox's details, including its ID and address.

- **Validation**: The request validates the `callbackUrl` and checks for allowed senders based on the specified service.

- **MCP Tool**: The `mailagent_create_inbox` tool is used in the MCP for creating inboxes.

- **Example Request**:
  ```json
  {
    "service": "auth0",
    "label": "test-inbox",
    "ttlMinutes": 30,
    "callbackUrl": "https://example.com/callback",
    "notifyEmail": "dev@company.com",
    "notifyMode": "verification"
  }
  ```

- **Error Handling**: If there are issues (e.g., invalid callback URL or exceeding domain limits), appropriate error messages are returned.

This process allows for the creation of temporary inboxes tailored for specific services, facilitating email verification and testing workflows.
