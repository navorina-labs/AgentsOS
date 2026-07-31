# MA07 (B)

## Answer

The following REST API endpoints exist for inboxes under the `/v1/inboxes` route:

- **POST** `/open`
  - One-shot: create → wait → extract → delete
- **GET** `/`
  - List inboxes by `label` or `labelPrefix`
- **POST** `/`
  - Create a new inbox
- **DELETE** `/`
  - Bulk delete inboxes by `labelPrefix`
- **GET** `/:id`
  - Retrieve inbox details and message count
- **DELETE** `/:id`
  - Delete a specific inbox
- **POST** `/:id/simulate`
  - Inject a test message into the inbox (no SMTP)
- **POST** `/:id/send`
  - Send an outbound message from the inbox
- **GET** `/:id/threads`
  - List threads in the inbox
- **GET** `/:id/threads/:threadId/messages`
  - Retrieve messages in a specific thread
- **GET** `/:id/search`
  - Perform keyword/semantic search in the inbox
- **GET** `/:id/diagnose`
  - Get debug hints for agents
- **GET** `/:id/callbacks`
  - Retrieve the callback delivery log for the inbox
- **GET** `/:id/messages`
  - List messages in the inbox
- **GET** `/:id/messages/:messageId/raw`
  - Retrieve raw MIME content of a specific message
- **GET** `/:id/messages/:messageId/attachments`
  - Get metadata for attachments of a specific message
- **GET** `/:id/messages/:messageId/attachments/:attachmentId`
  - Retrieve bytes or JSON for a specific attachment
- **GET** `/:id/extract/presets`
  - Get structured extract presets for the inbox
- **GET** `/:id/extract`
  - Retrieve the latest message verification DTO
- **POST** `/:id/messages/:messageId/extract`
  - Perform AI structured extraction on a message
- **GET** `/:id/events`
  - Subscribe to events in the inbox (SSE)
- **GET** `/:id/wait`
  - Long-poll for new messages (timeout max 120s)
