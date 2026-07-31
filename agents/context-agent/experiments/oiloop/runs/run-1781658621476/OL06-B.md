# OL06 (B)

## Answer

When a user requests 'organize downloads', the following steps occur:

- **File Scanning**: The `FileOrganizer` scans loose files in the Downloads folder.
- **Rule Evaluation**: The `UserRuleParser` checks for any user-defined rules (e.g., "don't touch" certain files) to determine which files should be skipped.
- **Proposed Moves**: The `FileOrganizeService` creates a plan proposing file movements based on the scanned files and the evaluation of rules.
- **Preview Confirmation**: The `FilePreviewSheet` displays a visual preview of the proposed moves, allowing the user to review the source paths, target folders, and any skipped items.
- **User Action**: The user can either:
  - Click "Apply moves" to confirm the proposed organization, which triggers `confirmPendingOrganize` on `ChatOrchestrator`.
  - Click "Cancel" to abort the operation, triggering `cancelPendingOrganize` on `ChatOrchestrator`.

All file moves must comply with the invariants, ensuring they only occur within whitelisted directories and with explicit user confirmation.
