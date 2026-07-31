# MA11 (B)

## Answer

- **Durable Object**: `InboxWait` holds subscriber writers.
- **Client Request**: `GET /v1/inboxes/:id/events` proxies to the Durable Object's `/subscribe` endpoint.
- **Message Ingestion**: When a new message is ingested, the queue consumer calls the Durable Object's `/notify` endpoint.
- **Broadcast**: The Durable Object broadcasts an event with `event: message` to all connected subscribers.
- **Fallback**: If SSE fails, clients can use `GET /v1/inboxes/:id/wait` to poll the server every 500ms for new messages.
