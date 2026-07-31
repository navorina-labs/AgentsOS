# MA33 (B)

## Answer

Custom domain inbox works as follows:

- **Requirements**:
  - Must have a `domainId` that corresponds to a verified custom domain.
  - Optionally, a `username` can be provided.

- **Creation Process**:
  1. The system checks if the domain belongs to the team using `getDomainForInbox(domainId, { teamId, apiKeyHint })`.
  2. The domain must have a status of "verified". If not, an error `domain_not_verified` is returned.
  3. The local part of the inbox address is validated using `sanitizeInboxLocalPart(username, fallback)`.
  4. The inbox address is constructed as `{local}@{domain.name}`, where `local` is either the sanitized username or a fallback (e.g., `inbox-{id}`).
  5. The `domain_id` is stored in the inbox record.

- **Error Handling**:
  - If `username` is provided without `domainId`, an error `username_requires_domain` is returned.

- **Usage**:
  - The custom domain inbox allows users to create inboxes that use their own verified domain, enhancing branding and control over email communications.
