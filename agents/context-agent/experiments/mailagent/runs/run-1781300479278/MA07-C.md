# MA07 (C)

## Answer

The following REST API endpoints exist for inboxes in the MailAgent project:

- **Create Inbox**
  - `POST /v1/inboxes`
  - Description: Create an inbox with options like `ttlMinutes`, `service`, `expectFrom`, `allowedSenders`, etc.

- **Open Inbox (One-shot)**
  - `POST /v1/inboxes/open`
  - Description: Create an inbox, wait for a message, extract data, and optionally delete the inbox.

- **Get Inbox Status**
  - `GET /v1/inboxes/:id`
  - Description: Retrieve the status of a specific inbox by its ID.

- **List Inboxes**
  - `GET /v1/inboxes`
  - Description: List inboxes by label or label prefix, with optional limit.

- **Get Messages in Inbox**
  - `GET /v1/inboxes/:id/messages`
  - Description: Retrieve messages for a specific inbox by its ID.

- **Extract Data from Inbox**
  - `GET /v1/inboxes/:id/extract`
  - Description: Extract OTP and links from the latest message in the inbox.

- **SSE for New Messages**
  - `GET /v1/inboxes/:id/events`
  - Description: Stream events for new messages in the inbox.

- **Wait for a Message**
  - `GET /v1/inboxes/:id/wait?timeout=60`
  - Description: Poll for a new message in the inbox with a specified timeout.

- **Get Callback Log**
  - `GET /v1/inboxes/:id/callbacks`
  - Description: Retrieve the delivery log for callbacks associated with the inbox.

- **Delete Inbox**
  - `DELETE /v1/inboxes/:id`
  - Description: Delete a specific inbox by its ID.
