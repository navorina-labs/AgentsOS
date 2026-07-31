# OL05 (C)

## Answer

Oiloop handles sandboxed folder access on macOS through the following mechanisms:

- **Security-scoped bookmarks**: Utilizes `URL.startAccessingSecurityScopedResource` to manage access to files within sandboxed directories.
- **File moves**: Only allows file moves within whitelisted bookmark directories, ensuring compliance with macOS sandbox regulations.
- **User confirmation**: No files are moved without explicit user confirmation, protecting user data from unintended actions.
- **Audit trail**: Skipped folders or paths during operations are logged in an audit trail for transparency and accountability.
