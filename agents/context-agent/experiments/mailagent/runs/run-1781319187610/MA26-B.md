# MA26 (B)

## Answer

The `callbackUrl` is used for the following purposes:

- **Inbound or Simulated Message Processing**: When a message is processed (either inbound or simulated), a POST request is sent to the specified `callbackUrl`.
- **Payload Delivery**: The POST request includes a JSON payload containing details such as `inboxId`, `otp`, `primaryLink`, and other relevant information.
- **Audit Logging**: Deliveries to the `callbackUrl` are logged in `callback_deliveries`, allowing for tracking and auditing of callback events.
- **Audit Retrieval**: You can retrieve the log of callback deliveries using the `GET …/callbacks` endpoint for audit purposes.
