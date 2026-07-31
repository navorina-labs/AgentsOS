# MA11 (B)

## Answer

SSE wait for new messages works as follows:

- **Durable Object (DO)**: Each inbox has a corresponding `InboxWait` Durable Object instance that manages the SSE connections.
- **Subscription**: Clients connect to the SSE stream via `GET /v1/inboxes/:id/events`, which proxies to the DO's `/subscribe` endpoint.
- **Message Notification**: When a new message is processed, the queue consumer calls the DO's `/notify` endpoint to broadcast the message to all connected clients.
- **Event Format**: The SSE events sent to clients include:
  - `event: connected` (initial connection)
  - `event: message` with the message data (e.g., OTP, primary link).
- **Fallback**: If the SSE connection is lost, clients can use `GET /v1/inboxes/:id/wait` to poll for new messages every 500ms for a maximum of 120 seconds.
