# OL05 (B)

## Answer

Oiloop handles sandboxed folder access on macOS through the following mechanisms:

- **Sandboxed Folder Bookmarks**: Utilizes security-scoped bookmarks to allow file operations while complying with macOS sandbox regulations.
- **WorkspaceAccess**: This entity persists and resolves sandbox bookmark security data, ensuring that file moves occur only within whitelisted bookmark directories.
- **User Confirmation**: No files are moved without explicit user confirmation, protecting user files from accidental actions.
