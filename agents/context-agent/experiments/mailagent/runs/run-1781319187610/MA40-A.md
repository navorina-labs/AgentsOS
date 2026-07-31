# MA40 (A)

## Answer

Scoped API keys and `labelPrefix` are enforced through the following mechanisms:

- **Scoped API Keys**:
  - Scoped keys restrict access based on specific criteria, such as `labelPrefix` and `readOnly` status.
  - When creating a scoped key, the `labelPrefix` must start with a specified prefix (e.g., `ci-` for CI jobs).
  - Scoped keys cannot perform actions like creating or deleting inboxes if they are marked as read-only.

- **Label Prefix Enforcement**:
  - The `labelPrefix` is checked during the creation of inboxes or when performing actions that require a specific label.
  - If an API key has a `labelPrefix`, any inbox created must start with that prefix; otherwise, an error is returned.
  - The system validates the `label` against the `labelPrefix` to ensure compliance.

- **Error Handling**:
  - Errors such as `label_required`, `label_prefix_mismatch`, and `scope_read_only` are returned if the conditions for using scoped keys or the `labelPrefix` are not met.

These checks ensure that API keys are used in a controlled manner, preventing unauthorized access and maintaining the integrity of the system.
