# OL06 (B)

## Answer

When a user requests 'organize downloads', the following steps occur:

- **FileOrganizer** scans loose files in the Downloads folder.
- It applies file classification rules to determine target category folders.
- **RuleEnforcer** checks if any files should be skipped based on user-defined rules (e.g., "dontTouch" rules).
- **FileOrganizeService** prepares a plan for proposed file movements, coordinating the organization process.
- A visual preview of the proposed moves is displayed via **FilePreviewSheet**, allowing the user to confirm or cancel the actions.
- If confirmed, the file moves are executed within the allowed sandboxed directories, ensuring compliance with security rules.

No files are moved without explicit user confirmation, and any skipped files are logged in the audit trail.
