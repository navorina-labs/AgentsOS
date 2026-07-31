# MA33 (A)

## Answer

The custom domain inbox in the MailAgent project works as follows:

- **Setup**:
  - Teams can register their own custom domains using the `POST /v1/domains` API endpoint.
  - The domain must be verified through DNS records, which are provided in the response when the domain is registered.

- **Usage**:
  - When creating an inbox, the `domainId` parameter is used to specify the custom domain.
  - The inbox will use an address format like `username@your-verified-domain.com`.

- **Verification**:
  - The domain verification process involves polling the DNS status using the `POST /v1/domains/:id/verify` endpoint.

- **Team Isolation**:
  - Each team has its own Resend account for handling inbound mail, ensuring that the email traffic is isolated from other teams.

- **Rate Limits**:
  - Custom domains are subject to the rate limits defined for the team's plan (e.g., free, pro, enterprise).

- **Security**:
  - The Resend API key and webhook secret for the custom domain are stored encrypted in the database.

This setup allows teams to have dedicated inboxes that use their own domains, enhancing branding and control over email communications.
