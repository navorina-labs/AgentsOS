# MA40 (A)

## Answer

Scoped API keys and labelPrefix enforcement in the MailAgent project are managed through the following mechanisms:

- **Scoped API Keys**:
  - Scoped keys restrict access based on specific criteria, such as `labelPrefix` and `readOnly` status.
  - A scoped key cannot create other keys, perform billing actions, or revoke keys.
  - The `labelPrefix` must extend from the parent key's prefix, ensuring that scoped keys are limited to specific operations.

- **Label Prefix Enforcement**:
  - When creating an inbox or performing actions, the `label` must start with the specified `labelPrefix` of the scoped key.
  - The system checks if the provided label matches the required prefix using the `assertLabelForCreate` function.
  - If the label does not match, an error is returned indicating the mismatch.

- **Validation Functions**:
  - Functions like `scopeLabelForCreate` and `assertWriteAllowed` are used to validate the scope of the API key and ensure that the operations being requested are permitted under the current key's restrictions.

These mechanisms ensure that API keys are used securely and that operations are limited to the intended scope, preventing unauthorized access or actions.
