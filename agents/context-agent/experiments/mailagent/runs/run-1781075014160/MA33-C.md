# MA33 (C)

## Answer

The custom domain inbox functionality works as follows:

- **Creation**: A custom domain inbox can be created using the `createInbox` function, which requires:
  - A verified custom domain ID.
  - Optional parameters such as `ttlMinutes`, `expectFrom`, `allowedSenders`, `label`, `callbackUrl`, `username`, and `apiKeyHint`.

- **Domain Verification**: The domain must be verified before it can be used for creating inboxes. This is done through the `verifyDomain` function, which checks the DNS records associated with the domain.

- **Address Format**: The inbox address is formatted as `localpart@domain`, where the local part is generated based on the provided username or a default format if no username is specified.

- **Allowed Senders**: The inbox can have a list of allowed senders, which restricts who can send emails to that inbox.

- **Callback URL**: A callback URL can be specified, which will be used for webhooks to notify the application of incoming messages.

- **Usage**: Once created, the inbox can receive emails sent to its address, and it can be used for various operations such as waiting for messages, extracting information, and sending outbound emails.

- **Domain Management**: The custom domains are managed through the `domains` service, which includes functions for listing, creating, and verifying domains.

This process ensures that the inbox is tied to a specific custom domain, allowing for more personalized and branded email interactions.
