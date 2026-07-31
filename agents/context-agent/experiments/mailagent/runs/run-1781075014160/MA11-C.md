# MA11 (C)

## Answer

The SSE (Server-Sent Events) wait mechanism for new messages in the MailAgent project works as follows:

- **Durable Object**: The `InboxWait` class is implemented as a Durable Object that manages subscribers waiting for new messages.
  
- **Subscription**:
  - Clients can subscribe to new message notifications by sending a GET request to the `/subscribe` endpoint.
  - A readable stream is created for each subscriber, allowing them to receive events.

- **Notification**:
  - When a new message is received, a POST request is sent to the `/notify` endpoint with the message payload.
  - The `broadcast` method sends the message payload to all connected subscribers.

- **Event Format**: Notifications are sent in the SSE format, which includes:
  - An event type (e.g., `message`)
  - The data payload containing the message details in JSON format.

- **Connection Management**: 
  - The connection remains open, allowing for real-time updates.
  - If a subscriber disconnects, they are removed from the list of active subscribers.

This setup allows clients to efficiently wait for and receive notifications about new messages without the need for long-polling.
