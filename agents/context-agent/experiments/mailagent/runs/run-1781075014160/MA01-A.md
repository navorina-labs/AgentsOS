# MA01 (A)

## Answer

OTP extraction in MailAgent works as follows:

- **Inbox Creation**: A temporary inbox is created using the API, typically with a service preset (e.g., `auth0`, `github`).
- **Email Reception**: The inbox waits for an email that matches the expected sender (defined by the `expectFrom` or `service` parameters).
- **Message Extraction**: Once an email is received, the inbox can extract the OTP and any links from the latest message using the `GET /v1/inboxes/:id/extract` endpoint.
- **Verification**: The extracted OTP or primary link can then be used to complete the signup or verification process.

### Key API Endpoints:
- **Create Inbox**: `POST /v1/inboxes`
- **Wait for Message**: `GET /v1/inboxes/:id/wait`
- **Extract OTP/Links**: `GET /v1/inboxes/:id/extract`

### Typical Flow:
1. Create an inbox.
2. Submit the email address to the signup form of the service.
3. Wait for the email to arrive.
4. Extract the OTP or primary link from the email.
5. Use the OTP or link to complete the signup process.
