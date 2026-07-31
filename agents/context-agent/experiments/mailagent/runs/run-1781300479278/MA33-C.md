# MA33 (C)

## Answer

The custom domain inbox functionality involves the following key aspects:

- **Creation**: A custom domain inbox is created by associating it with a verified custom domain. This requires the domain to be registered and verified through the system.
  
- **Domain Verification**: Before an inbox can be created, the domain must be verified. If the domain is not verified, the inbox creation will fail.

- **Inbox Address**: The inbox address is generated using a local part (username) and the verified domain name, formatted as `username@domain`.

- **Allowed Senders**: The inbox can have a list of allowed senders, which can be specified during its creation.

- **Callback URL**: A callback URL can be set for the inbox, which will be used for notifications related to incoming messages.

- **Notification Settings**: Users can specify a notification email and mode (e.g., verification) to receive updates about the inbox.

- **Team Association**: The inbox can be associated with a team, allowing for team-specific management and usage tracking.

- **Usage Limits**: The number of custom domains and inboxes may be limited based on the user's subscription plan.

- **APIs**: The functionality is accessible through various API endpoints, allowing for programmatic management of custom domains and inboxes.

This process ensures that users can create and manage temporary inboxes that utilize their own domains for receiving emails.
