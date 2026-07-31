# MA06 (A)

## Answer

Inbox creation in the MailAgent project works as follows:

1. **API Endpoint**: 
   - The primary endpoint for creating an inbox is `POST /v1/inboxes`.

2. **Request Body**: 
   - The request body can include the following parameters:
     - `ttlMinutes`: Time-to-live for the inbox in minutes.
     - `service`: Preset allowlist (e.g., `github`, `google`).
     - `expectFrom`: Expected sender(s) for the inbox.
     - `allowedSenders`: List of allowed senders.
     - `label`: Optional label for the inbox.
     - `callbackUrl`: Optional URL for webhook callbacks.
     - `username`: Local part for custom domain inbox (if applicable).
     - `domainId`: Verified domain ID for custom domains.

3. **Validation**:
   - The API checks if the request parameters are valid, including:
     - Ensuring the `callbackUrl` is valid and uses HTTPS.
     - Checking the inbox quota for the user/team.
     - Validating the label against the API key's scope.

4. **Inbox Creation**:
   - If validation passes, the inbox is created using the provided parameters.
   - The API returns the inbox details, including the generated address.

5. **Response**:
   - The response includes:
     - `id`: The unique identifier for the inbox.
     - `address`: The email address of the created inbox.
     - `expiresAt`: Expiration time of the inbox.
     - `allowedSenders`: List of allowed senders for the inbox.

6. **Error Handling**:
   - If any errors occur during the creation process (e.g., quota exceeded, invalid parameters), appropriate error messages are returned.

This process allows for the creation of temporary inboxes tailored to specific services and requirements, facilitating automated email verification and testing.
