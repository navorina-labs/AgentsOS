# MA33 (B)

## Answer

Custom domain inbox works as follows:

- **Requirements**:
  - Must have a `domainId` that corresponds to a verified custom domain.
  - Optionally, a `username` can be provided.

- **Creation Process**:
  1. The system checks if the `domainId` belongs to the team using `getDomainForInbox(domainId, { teamId, apiKeyHint })`.
  2. It verifies that the domain status is "verified". If not, it returns an error (`domain_not_verified`).
  3. The local part of the inbox address is sanitized using `sanitizeInboxLocalPart(username, fallback)`.
  4. The inbox address is constructed as `{local}@{domain.name}`, and the `domain_id` is stored in the inbox record.

- **Error Handling**:
  - If `username` is provided without `domainId`, it returns an error (`username_requires_domain`).

- **Usage**:
  - The custom domain inbox allows users to create inboxes with addresses that match their verified domains, enhancing branding and usability.
