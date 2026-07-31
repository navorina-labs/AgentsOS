# MA40 (B)

## Answer

Scoped API keys and `labelPrefix` are enforced through the following mechanisms:

### Scoped API Keys
- **Creation Requirement**: When creating an inbox, the `label` must start with the specified `labelPrefix` if a scope is defined.
- **Access Control**: Scoped keys cannot access inboxes that do not match their `labelPrefix`. This is enforced by:
  - `scopeLabelForCreate(c, label)`: Ensures the label matches the prefix.
  - `scopeInboxDenied(c, inbox)`: Checks if the inbox ID matches the allowed prefix; returns 404 if it does not.

### labelPrefix Enforcement
- **Prefix Matching**: The `labelPrefix` must be the starting part of the inbox label when creating or managing inboxes.
- **Error Handling**: If a scoped key attempts to create or access an inbox with a label that does not start with the `labelPrefix`, the system responds with:
  - `label_required` or `label_prefix_mismatch` errors for creation.
  - `inbox_not_found` (404) for access attempts to non-matching inboxes.

### Additional Rules
- **Read-Only Scope**: If a key has a `readOnly` scope, it blocks write operations (e.g., creating, deleting inboxes).
- **Narrowing Scope**: Child keys can inherit a narrower scope from parent keys, ensuring that permissions are appropriately restricted.

These mechanisms ensure that scoped API keys are used securely and that access to resources is properly controlled based on the defined scopes.
