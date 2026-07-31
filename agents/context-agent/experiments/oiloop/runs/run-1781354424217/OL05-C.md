# OL05 (C)

## Answer

Oiloop handles sandboxed folder access on macOS through the following mechanisms:

- **Security-scoped bookmarks**: It uses security-scoped bookmarks to allow file operations while complying with macOS sandbox regulations.
- **WorkspaceAccess**: This entity persists and resolves sandbox bookmark security data.
- **File moves**: File moves must only occur within whitelisted bookmark directories, ensuring that no files are moved without explicit user confirmation.
- **User rules**: The application evaluates user-defined rules to prevent unwanted file moves, ensuring that certain file patterns are ignored.
- **Audit trail**: Skipped folders or paths during file operations are logged in an audit trail for accountability.
