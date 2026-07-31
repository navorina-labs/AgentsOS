# MA11 (C)

## Answer

The SSE (Server-Sent Events) wait mechanism for new messages in the MailAgent project works as follows:

- **Durable Object**: The `InboxWait` class is implemented as a Durable Object that manages subscribers waiting for new messages.
  
- **Subscription**:
  - Clients can subscribe to new messages by sending a GET request to the `/subscribe` endpoint.
  - A readable stream is created for each subscriber, allowing them to receive updates.

- **Broadcasting Messages**:
  - When a new message is received, a POST request is sent to the `/notify` endpoint with the message payload.
  - The `broadcast` method sends the message data to all connected subscribers.

- **Event Stream**:
  - Subscribers receive messages in the format of SSE, which includes events like `connected` and `message`.
  - The connection remains open, allowing for real-time updates without the need for polling.

- **Error Handling**:
  - If a subscriber disconnects or an error occurs while sending a message, the subscriber is removed from the set of active subscribers.

This mechanism allows clients to efficiently wait for and receive new messages as they arrive, reducing the need for constant polling.
