# MA33 (A)

## Answer

The custom domain inbox in the MailAgent project works as follows:

- **Setup**: 
  - Requires a verified custom domain to be registered with Resend.
  - The domain is added via the API using `POST /v1/domains`, which returns DNS records to configure.

- **Creating Inboxes**:
  - When creating an inbox, you specify the `username` (local part of the email) and the `domainId` (the verified custom domain).
  - The API call to create an inbox is made using `POST /v1/inboxes`, which will use the specified custom domain.

- **Sending Emails**:
  - Outbound emails can be sent from the custom domain inbox using `POST /v1/inboxes/:id/send`.
  - The `OUTBOUND_FROM` environment variable must be set to a verified email address from the custom domain.

- **Team Isolation**:
  - Each team can have its own dedicated Resend account for custom domains, ensuring isolation from other teams' email traffic.

- **Verification**:
  - The domain must be verified before it can be used for sending emails. This is done by polling the DNS verification status using `POST /v1/domains/:id/verify`.

- **Error Handling**:
  - If an inbox is created without a custom domain, or if the domain is not verified, appropriate error messages are returned.

This setup allows teams to use their own domains for email verification processes, enhancing branding and control over email communications.
