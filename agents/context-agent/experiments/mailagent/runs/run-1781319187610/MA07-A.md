# MA07 (A)

## Answer

The following REST API endpoints exist for managing inboxes:

1. **Create Inbox**
   - **Method:** `POST`
   - **Path:** `/v1/inboxes`
   - **Description:** Create a new inbox with optional parameters like `ttlMinutes`, `service`, `expectFrom`, `allowedSenders`, `label`, `callbackUrl`, `notifyEmail`, and `notifyMode`.

2. **Open Inbox (One-shot)**
   - **Method:** `POST`
   - **Path:** `/v1/inboxes/open`
   - **Description:** Create an inbox, wait for a message, extract OTP/links, and delete the inbox.

3. **Get Inbox Status**
   - **Method:** `GET`
   - **Path:** `/v1/inboxes/:id`
   - **Description:** Retrieve the status of a specific inbox by its ID.

4. **List Inboxes**
   - **Method:** `GET`
   - **Path:** `/v1/inboxes`
   - **Description:** List all inboxes, optionally filtered by `label` or `labelPrefix`.

5. **List Messages in Inbox**
   - **Method:** `GET`
   - **Path:** `/v1/inboxes/:id/messages`
   - **Description:** Retrieve messages associated with a specific inbox.

6. **Extract OTP and Links from Latest Message**
   - **Method:** `GET`
   - **Path:** `/v1/inboxes/:id/extract`
   - **Description:** Extract OTP and links from the latest message in the inbox.

7. **Wait for New Message**
   - **Method:** `GET`
   - **Path:** `/v1/inboxes/:id/wait`
   - **Description:** Poll for a new message in the inbox.

8. **Delete Inbox**
   - **Method:** `DELETE`
   - **Path:** `/v1/inboxes/:id`
   - **Description:** Delete a specific inbox by its ID.

9. **Get Callback Delivery Log**
   - **Method:** `GET`
   - **Path:** `/v1/inboxes/:id/callbacks`
   - **Description:** Retrieve the delivery log for the `callbackUrl` associated with the inbox.

10. **Get Notify Deliveries Log**
    - **Method:** `GET`
    - **Path:** `/v1/inboxes/:id/notify-deliveries`
    - **Description:** Retrieve the delivery log for the `notifyEmail` associated with the inbox.

These endpoints allow for comprehensive management of inboxes, including creation, retrieval, message handling, and deletion.
