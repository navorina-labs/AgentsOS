# MA07 (B)

## Answer

The REST API endpoints for inboxes (`/v1/inboxes`) are:

- **POST** `/open`
- **GET/POST/DELETE** `/`
- **GET/DELETE** `/:id`
- **POST** `/:id/simulate`
- **POST** `/:id/send`
- **POST** `/:id/messages/:messageId/reply`
- **GET** `/:id/threads`
- **GET** `/:id/threads/:threadId/messages`
- **GET** `/:id/search`
- **GET** `/:id/diagnose`
- **GET** `/:id/callbacks`
- **GET** `/:id/messages`
- **GET** `/:id/messages/:messageId/raw`
- **GET** `/:id/messages/:messageId/attachments`
- **GET** `/:id/messages/:messageId/attachments/:attachmentId`
- **GET** `/:id/extract`
- **GET** `/:id/extract/presets`
- **POST** `/:id/messages/:messageId/extract`
- **GET** `/:id/events`
- **GET** `/:id/wait`
