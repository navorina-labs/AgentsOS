# MA11 (B)

## Answer

SSE wait for new messages works as follows:

- **Durable Object (DO)**: Each inbox has a corresponding `InboxWait` Durable Object instance that manages connections for Server-Sent Events (SSE).
- **Subscription**: Clients connect to the SSE stream via `GET /v1/inboxes/:id/events`, which proxies to the DO's `/subscribe` endpoint.
- **Message Notification**: When a new message is processed, the queue consumer calls the DO's `POST /notify` endpoint to notify subscribers.
- **Event Format**: The DO broadcasts events in the format:
  ```
  event: message
  data: {"id":"…","otp":"123456","primaryLink":"https://…",…}
  ```
- **Fallback Mechanism**: If the SSE connection is lost, clients can use `GET /v1/inboxes/:id/wait` to poll for new messages every 500ms, up to a maximum of 120 seconds.
