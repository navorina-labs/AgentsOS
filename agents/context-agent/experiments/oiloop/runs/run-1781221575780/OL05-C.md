# OL05 (C)

## Answer

Oiloop handles sandboxed folder access on macOS through the following mechanisms:

- **Security-scoped bookmarks**: It uses security-scoped bookmarks to allow file operations while complying with macOS sandbox regulations.
- **Explicit user confirmation**: No files are moved without explicit user confirmation, ensuring user control over file operations.
- **Whitelisted directories**: File moves must only occur within whitelisted bookmark directories, preventing unauthorized access to other parts of the file system.
- **Audit trail**: Skipped folders or paths must be logged in the audit trail, maintaining a record of file operations.
