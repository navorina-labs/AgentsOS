# MA07 (B)

## Answer

The following REST API endpoints exist for inboxes under the `/v1/inboxes` route:

- **POST** `/open`
  - One-shot: create, wait, extract, delete.
  
- **GET** `/`
  - List inboxes by `label` or `labelPrefix`.
  
- **POST** `/`
  - Create a new inbox.
  
- **DELETE** `/`
  - Bulk delete inboxes by `labelPrefix`.
  
- **GET** `/:id`
  - Retrieve details of a specific inbox by ID.
  
- **DELETE** `/:id`
  - Delete a specific inbox by ID.
  
- **POST** `/:id/simulate`
  - Inject a test message into a specific inbox.
  
- **POST** `/:id/send`
  - Send an outbound message from a specific inbox.
  
- **POST** `/:id/messages/:messageId/reply`
  - Reply to a message in a specific inbox thread.
  
- **GET** `/:id/threads`
  - List threads in a specific inbox.
  
- **GET** `/:id/threads/:threadId/messages`
  - Retrieve messages in a specific thread of an inbox.
  
- **GET** `/:id/search`
  - Perform keyword/semantic search in a specific inbox.
  
- **GET** `/:id/diagnose`
  - Get debug hints for a specific inbox.
  
- **GET** `/:id/callbacks`
  - Retrieve the callback delivery log for a specific inbox.
  
- **GET** `/:id/messages`
  - List messages in a specific inbox.
  
- **GET** `/:id/messages/:messageId/raw`
  - Retrieve raw MIME content of a specific message.
  
- **GET** `/:id/messages/:messageId/attachments`
  - Get metadata for attachments of a specific message.
  
- **GET** `/:id/messages/:messageId/attachments/:attachmentId`
  - Retrieve bytes or JSON for a specific attachment.
  
- **GET** `/:id/extract/presets`
  - Get structured extract presets for a specific inbox.
  
- **GET** `/:id/extract`
  - Retrieve the latest message verification DTO for a specific inbox.
  
- **POST** `/:id/messages/:messageId/extract`
  - Perform AI structured extraction on a specific message.
  
- **GET** `/:id/events`
  - Subscribe to events for a specific inbox (SSE).
  
- **GET** `/:id/wait`
  - Long-poll for messages in a specific inbox (timeout max 120s).
