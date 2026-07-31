# MA40 (B)

## Answer

Scoped API keys and `labelPrefix` are enforced through the following mechanisms:

### Scoped API Keys
- **Definition**: Scoped keys have specific permissions defined by their scope, which includes `labelPrefix` and `readOnly` attributes.
- **Operations**:
  - **Read-Only**: If a key is marked as `readOnly`, it blocks write operations (e.g., `POST`, `DELETE`) through the `scopeWriteDenied` guard.
  - **Admin Operations**: Certain operations require unrestricted keys, checked by `isRestrictedScope()`, which returns a 403 error if the key is restricted.

### labelPrefix Enforcement
- **Creation Requirement**: When creating an inbox, the `label` must start with the specified `labelPrefix` if the scope is defined.
- **Access Control**:
  - **GET Requests**: Scoped keys cannot access inboxes with labels that do not match their `labelPrefix`. This is enforced by the `scopeLabelForCreate` and `scopeInboxDenied` guards.
  - **Error Handling**: If an inbox is accessed that does not match the prefix, a 404 error (`inbox_not_found`) is returned instead of a 403, to prevent enumeration of inboxes.

### Summary
- Scoped keys restrict operations based on their defined scope.
- `labelPrefix` ensures that keys can only interact with inboxes that match their specified prefix, enhancing security and isolation between tenants.
