# MA33 (B)

## Answer

A custom domain inbox works as follows:

- **Creation**: 
  - Requires `username` and `domainId` in the request body when creating an inbox.
  - The domain must be verified.

- **Address Format**: 
  - The inbox address is formatted as `{username}@{verified-domain}`.

- **Allowed Senders**: 
  - The `allowed_senders` field can be specified to create a sender allowlist.

- **API Interaction**: 
  - Created via the `POST /v1/inboxes` endpoint with the necessary parameters.

- **Errors**: 
  - Possible errors include `domain_not_found`, `domain_not_verified`, and `username_requires_domain` if the domain is not verified or not provided.

This information is essential for understanding how to set up and manage custom domain inboxes within the MailAgent project.
