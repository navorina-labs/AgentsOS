# MA40 (C)

## Answer

Scoped API keys and `labelPrefix` are enforced through several mechanisms in the MailAgent project:

- **API Key Scope**:
  - Each API key has an associated scope defined by `labelPrefix` and `readOnly` attributes.
  - The scope determines the permissions and constraints for the API key.

- **Scope Validation Functions**:
  - Functions like `assertWriteAllowed`, `assertLabelForCreate`, and `assertInboxAccessible` are used to check if the operations requested by the API key are allowed based on its scope.
  - For example, `assertLabelForCreate` ensures that any label provided for a new key starts with the defined `labelPrefix`.

- **Narrowing Scope**:
  - The `narrowScope` function allows for creating sub-keys with more restricted scopes based on a parent key's scope, ensuring that child keys adhere to the parent's constraints.

- **Error Handling**:
  - If a request violates the scope constraints (e.g., trying to create a key with a label that does not match the `labelPrefix`), appropriate error responses are returned, such as "label_prefix_mismatch" or "scope_read_only".

- **Route Middleware**:
  - Middleware functions like `scopeAdminDenied` check if the current operation requires an unrestricted key and deny access if the key is restricted.

These mechanisms collectively ensure that API keys operate within their defined scopes, maintaining security and proper access control.
