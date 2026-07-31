# MA07 (C)

## Answer

The following REST API endpoints exist for inboxes in the MailAgent project:

- **Create Inbox**
  - **Method:** `POST`
  - **Path:** `/v1/inboxes`
  - **Description:** Create an inbox with options like `ttlMinutes`, `service`, `expectFrom`, `allowedSenders`, etc.

- **Open Inbox (One-shot)**
  - **Method:** `POST`
  - **Path:** `/v1/inboxes/open`
  - **Description:** Create an inbox, wait for a message, extract information, and optionally delete the inbox.

- **Get Inbox Status**
  - **Method:** `GET`
  - **Path:** `/v1/inboxes/:id`
  - **Description:** Retrieve the status of a specific inbox by its ID.

- **List Inboxes**
  - **Method:** `GET`
  - **Path:** `/v1/inboxes`
  - **Description:** List inboxes by label or label prefix, with optional limit.

- **Get Messages in Inbox**
  - **Method:** `GET`
  - **Path:** `/v1/inboxes/:id/messages`
  - **Description:** Retrieve messages for a specific inbox by its ID.

- **Extract Information from Inbox**
  - **Method:** `GET`
  - **Path:** `/v1/inboxes/:id/extract`
  - **Description:** Extract OTP and links from the latest message in the inbox.

- **Wait for a Message**
  - **Method:** `GET`
  - **Path:** `/v1/inboxes/:id/wait?timeout=60`
  - **Description:** Poll for a new message in the inbox.

- **Get Callback Log**
  - **Method:** `GET`
  - **Path:** `/v1/inboxes/:id/callbacks`
  - **Description:** Retrieve the delivery log for callbacks associated with the inbox.

- **Delete Inbox**
  - **Method:** `DELETE`
  - **Path:** `/v1/inboxes/:id`
  - **Description:** Delete a specific inbox by its ID.

- **Search Messages in Inbox**
  - **Method:** `GET`
  - **Path:** `/v1/inboxes/:id/search?q=`
  - **Description:** Search for messages in the inbox based on a query.

These endpoints facilitate various operations related to managing and interacting with inboxes in the MailAgent system.
