# OL06 (B)

## Answer

When a user requests 'organize downloads', the following steps occur:

- **File Classification**: The system evaluates files in the Downloads folder based on predefined classification rules.
- **Proposed Moves**: The `FileOrganizer` generates a list of proposed file moves to appropriate target category folders.
- **User Confirmation**: The `FileOrganizeService` holds the proposed state and coordinates with the user for confirmation of the proposed moves.
- **Execution of Moves**: Upon user confirmation, files are moved only within whitelisted bookmark directories, adhering to the invariants.
- **Logging**: Any skipped folders or paths during the process are logged in the audit trail. 

No files are moved without explicit user confirmation, ensuring user control over the organization process.
