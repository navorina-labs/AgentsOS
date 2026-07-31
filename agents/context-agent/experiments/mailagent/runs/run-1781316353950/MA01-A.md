# MA01 (A)

## Answer

OTP extraction in MailAgent works as follows:

- **Inbox Creation**: A temporary inbox is created using the API, typically with a service preset (e.g., `auth0`, `github`).
- **Email Reception**: The service sends a verification email to the created inbox.
- **Waiting for Email**: The agent can either:
  - Use the `mailagent_wait_for_message` tool to block until a message arrives.
  - Use the `mailagent_wait_and_extract` tool, which combines creating an inbox, waiting for a message, and extracting the OTP in one step.
- **Extraction**: Once the email is received, the latest message is processed to extract the OTP:
  - The OTP is typically found in the email body, which is parsed to retrieve the code.
  - The extraction can also return links (e.g., magic links) from the email.
- **Response**: The extracted OTP and any relevant links are returned to the agent for further processing.

### Key API Endpoints:
- **Create Inbox**: `POST /v1/inboxes`
- **Wait for Message**: `GET /v1/inboxes/:id/wait`
- **Extract OTP**: `GET /v1/inboxes/:id/extract`

### Example Usage:
- To extract the OTP, the agent can call:
  ```bash
  curl -sS "$MAILAGENT_API_URL/v1/inboxes/:id/extract" \
    -H "Authorization: Bearer $MAILAGENT_API_KEY"
  ```

This process allows for automated verification without manual checks, making it suitable for CI/CD environments.
