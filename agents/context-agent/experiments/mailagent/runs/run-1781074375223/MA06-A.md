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
   - The API checks if the user has permission to create an inbox based on their API key scope.
   - It validates the `callbackUrl` to ensure it is a valid HTTPS URL.
   - It checks the quota for active inboxes to ensure the limit is not exceeded.

4. **Inbox Creation**:
   - If all validations pass, the inbox is created using the provided parameters.
   - The API returns the inbox details, including its ID and address.

5. **Response**:
   - On successful creation, the response includes:
     - `id`: The unique identifier for the inbox.
     - `address`: The email address of the created inbox.
     - Other relevant metadata (e.g., expiration time, allowed senders).

6. **Error Handling**:
   - If any validation fails, appropriate error messages are returned, such as `invalid_callback_url`, `inbox_limit_reached`, or `domain_not_found`.

This process allows for the dynamic creation of temporary inboxes for various services, facilitating email verification and other workflows.
