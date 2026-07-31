# MA01 (A)

## Answer

OTP extraction in MailAgent works as follows:

- **Inbox Creation**: A temporary inbox is created using the API, typically with a service preset (e.g., `auth0`, `github`).
- **Email Reception**: The application sends a verification email to the created inbox.
- **Waiting for Email**: The agent can either:
  - Use the `mailagent_wait_for_message` tool to block until a message arrives.
  - Use the `mailagent_wait_and_extract` tool, which combines creating an inbox, waiting for a message, and extracting the OTP in one step.
- **Extraction Process**:
  - The latest message in the inbox is checked for OTP or links.
  - The OTP is extracted from the message body, which is typically structured to include the OTP and any relevant links.
- **Response**: The extracted OTP and any links are returned to the agent for further processing (e.g., submitting the OTP to complete a signup).

### Key API Endpoints:
- **Create Inbox**: `POST /v1/inboxes`
- **Wait for Message**: `GET /v1/inboxes/:id/wait`
- **Extract OTP**: `GET /v1/inboxes/:id/extract`

### Example Usage:
- The agent can call `mailagent_wait_and_extract` to create an inbox, wait for the email, and extract the OTP in a single operation.
