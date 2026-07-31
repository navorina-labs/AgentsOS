# MA11 (A)

## Answer

SSE (Server-Sent Events) wait for new messages in MailAgent works as follows:

- **Durable Object**: The `InboxWait` class is used to manage subscriptions for new messages.
- **Subscription**: Clients can subscribe to a specific inbox using the `/subscribe` endpoint, which establishes a connection for receiving events.
- **Broadcasting**: When a new message is received, the system broadcasts a notification to all active subscribers using the `broadcast` method.
- **Event Format**: Notifications are sent in a specific format, including details about the message, such as the inbox ID, OTP, and links.
- **Keep-Alive**: The connection remains open, allowing the server to push updates to the client as new messages arrive.
- **Error Handling**: If the connection is closed or an error occurs, the subscriber is removed from the list of active subscribers.

This mechanism allows clients to receive real-time updates about new messages without the need for polling.
