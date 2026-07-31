# MA11 (A)

## Answer

SSE (Server-Sent Events) wait for new messages in MailAgent works as follows:

- **Durable Object**: The `InboxWait` class is used to manage subscriptions for waiting for messages.
- **Subscription**: Clients can subscribe to new messages by sending a GET request to the `/subscribe` endpoint.
- **Broadcasting**: When a new message is received, the system broadcasts a notification to all subscribed clients using the `notifyInbox` function.
- **Event Format**: Notifications are sent in a specific SSE format, which includes the event type and data (e.g., message details).
- **Connection Handling**: The connection remains open, allowing the server to push updates to the client as new messages arrive.
- **Error Handling**: If the connection is closed or an error occurs, the subscriber is removed from the list of active subscribers.

This mechanism allows clients to receive real-time updates about new messages without needing to poll the server continuously.
