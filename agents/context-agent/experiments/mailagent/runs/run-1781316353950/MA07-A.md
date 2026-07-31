# MA07 (A)

## Answer

The following REST API endpoints exist for managing inboxes:

1. **List Inboxes**
   - **Method:** `GET`
   - **Path:** `/v1/inboxes`
   - **Description:** List inboxes (can filter by label or labelPrefix).

2. **Create Inbox**
   - **Method:** `POST`
   - **Path:** `/v1/inboxes`
   - **Description:** Create a new inbox.

3. **Get Inbox**
   - **Method:** `GET`
   - **Path:** `/v1/inboxes/:id`
   - **Description:** Retrieve the status of a specific inbox.

4. **List Messages**
   - **Method:** `GET`
   - **Path:** `/v1/inboxes/:id/messages`
   - **Description:** List messages in a specific inbox.

5. **Extract OTP and Links**
   - **Method:** `GET`
   - **Path:** `/v1/inboxes/:id/extract`
   - **Description:** Extract OTP and links from the latest message in the inbox.

6. **Wait for Message**
   - **Method:** `GET`
   - **Path:** `/v1/inboxes/:id/wait`
   - **Description:** Block until a message arrives in the inbox.

7. **Callback Log**
   - **Method:** `GET`
   - **Path:** `/v1/inboxes/:id/callbacks`
   - **Description:** Retrieve the delivery log for the callback URL.

8. **Delete Inbox**
   - **Method:** `DELETE`
   - **Path:** `/v1/inboxes/:id`
   - **Description:** Delete a specific inbox.

9. **Bulk Delete Inboxes**
   - **Method:** `DELETE`
   - **Path:** `/v1/inboxes`
   - **Description:** Bulk delete inboxes by label prefix.

These endpoints allow for comprehensive management of inboxes, including creation, retrieval, message handling, and deletion.
