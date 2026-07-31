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
   - **Description:** Create an inbox, wait for a message, extract OTP/links, and delete the inbox in one call.

3. **Get Inbox Status**
   - **Method:** `GET`
   - **Path:** `/v1/inboxes/:id`
   - **Description:** Retrieve the status of a specific inbox by its ID.

4. **List Messages in Inbox**
   - **Method:** `GET`
   - **Path:** `/v1/inboxes/:id/messages`
   - **Description:** List all messages in a specific inbox.

5. **Extract OTP and Links from Latest Message**
   - **Method:** `GET`
   - **Path:** `/v1/inboxes/:id/extract`
   - **Description:** Extract OTP and links from the latest message in the inbox.

6. **Wait for New Message**
   - **Method:** `GET`
   - **Path:** `/v1/inboxes/:id/events`
   - **Description:** Server-Sent Events (SSE) to wait for new messages in the inbox.

7. **Poll for New Message (Fallback)**
   - **Method:** `GET`
   - **Path:** `/v1/inboxes/:id/wait?timeout=60`
   - **Description:** Poll for a new message in the inbox with a specified timeout.

8. **Delete Inbox**
   - **Method:** `DELETE`
   - **Path:** `/v1/inboxes/:id`
   - **Description:** Delete a specific inbox by its ID.

9. **Bulk Delete Inboxes by Label Prefix**
   - **Method:** `DELETE`
   - **Path:** `/v1/inboxes`
   - **Description:** Delete multiple inboxes that match a specified label prefix.

10. **Get Inbox Statistics**
    - **Method:** `GET`
    - **Path:** `/v1/stats`
    - **Description:** Retrieve usage counters for inboxes and messages over the last 24 hours.

These endpoints allow for comprehensive management of inboxes, including creation, retrieval, message handling, and deletion.
