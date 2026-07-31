# OL06 (B)

## Answer

When a user requests 'organize downloads', the following process occurs:

- **File Classification**: The system evaluates files in the Downloads folder based on predefined classification rules.
- **Proposed Moves**: The `FileOrganizer` generates a list of proposed file moves from the Downloads folder to target category folders.
- **FilePreviewSheet**: A `FilePreviewSheet` (SwiftUI) is presented to the user, displaying the proposed moves (source → target) and any skipped items.
- **User Confirmation**: The user can either:
  - **Apply**: Confirm the proposed moves, which triggers `confirmPendingOrganize` on `ChatOrchestrator`.
  - **Cancel**: Abort the operation, triggering `cancelPendingOrganize`.
- **Logging**: Any skipped folders or paths are logged in the audit trail.

Throughout this process, file moves only occur within whitelisted bookmark directories, and no files are moved without explicit user confirmation.
