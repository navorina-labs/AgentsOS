# MA01 (A)

## Answer

OTP extraction in MailAgent works as follows:

- **Inbox Creation**: A temporary inbox is created using the API, specifying parameters such as `service`, `label`, and `callbackUrl`.
- **Email Reception**: The inbox waits for an email that matches the specified criteria (e.g., from a specific sender or containing certain subjects).
- **Extraction**: Once an email is received, the inbox can extract the OTP and any links from the latest message using the `GET /v1/inboxes/:id/extract` endpoint.
- **Verification**: The extracted OTP or primary link can then be used to complete the signup or verification process.

### Key API Tools:
- **`mailagent_verify_signup`**: Preferred method to wait for verification email and return the OTP or magic link.
- **`mailagent_wait_and_extract`**: A one-shot flow that creates an inbox, waits for a message, extracts the OTP, and optionally deletes the inbox.
- **`mailagent_extract_verification`**: Specifically extracts OTP and links from the latest message in the inbox.

### Example Flow:
1. Create an inbox.
2. Submit the email address to a signup form.
3. Wait for the email to arrive.
4. Extract the OTP or primary link from the email.
5. Use the OTP or link to complete the signup process.
