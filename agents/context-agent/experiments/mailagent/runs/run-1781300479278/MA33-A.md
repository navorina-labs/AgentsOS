# MA33 (A)

## Answer

The custom domain inbox in the MailAgent project works as follows:

- **Setup**: 
  - Teams can register a custom domain using the `POST /v1/domains` endpoint.
  - The domain must be verified through DNS records, which are provided in the response when the domain is registered.

- **Usage**:
  - When creating an inbox, the `domainId` parameter is used to specify the custom domain.
  - The inbox is created with a username that corresponds to the local part of the email address (e.g., `username@customdomain.com`).

- **Verification**:
  - The system checks the DNS records to ensure the domain is properly configured and verified before allowing the inbox to be used.

- **Team Isolation**:
  - Each team has its own Resend account for handling emails sent to the custom domain, ensuring that the email traffic is isolated from other teams.

- **API Interaction**:
  - The inbox can be managed through various API endpoints, allowing for actions like sending emails, receiving messages, and checking inbox status.

For more detailed steps on how to set up and use custom domains, refer to the [dedicated domains documentation](https://webmailagent.com/docs/dedicated-domains.html).
