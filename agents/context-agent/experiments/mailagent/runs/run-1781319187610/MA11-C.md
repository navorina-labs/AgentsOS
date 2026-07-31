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
  - Subscribers receive events in the format of `event: message\ndata: {messageData}\n\n`, where `{messageData}` is the JSON representation of the new message.

- **Connection Management**:
  - The connection remains open, allowing for real-time updates until the subscriber disconnects or the connection is terminated.

This mechanism allows clients to efficiently wait for and receive notifications about new messages without the need for long polling.
