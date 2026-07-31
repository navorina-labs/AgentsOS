# MA40 (C)

## Answer

Scoped API keys and `labelPrefix` are enforced through several mechanisms in the MailAgent project:

- **API Key Scope**:
  - Each API key has an associated scope defined by `labelPrefix` and `readOnly` attributes.
  - The scope determines the permissions and constraints for the API key, such as whether it can create sub-keys or access certain resources.

- **Scope Validation Functions**:
  - Functions like `assertWriteAllowed`, `assertLabelForCreate`, and `assertInboxAccessible` are used to validate the permissions of the API key based on its scope.
  - For example, `assertLabelForCreate` checks if a label for a new key starts with the `labelPrefix` of the parent key.

- **Narrowing Scope**:
  - The `narrowScope` function allows for creating sub-keys with a more restricted scope based on the parent key's scope.
  - It ensures that the new key's `labelPrefix` extends the parent's `labelPrefix`.

- **Error Handling**:
  - If a key attempts to perform an action that violates its scope (e.g., creating a key with an invalid label), an error response is generated, indicating the specific violation (e.g., "label_prefix_mismatch").

- **Route Guards**:
  - Middleware functions like `scopeAdminDenied` check if the current API key has the necessary permissions to perform administrative actions, returning an error if the key is restricted.

These mechanisms collectively enforce the constraints associated with scoped API keys and their `labelPrefix`.
