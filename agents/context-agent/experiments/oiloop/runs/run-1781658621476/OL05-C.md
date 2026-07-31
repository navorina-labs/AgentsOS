# OL05 (C)

## Answer

Oiloop handles sandboxed folder access on macOS through the following mechanisms:

- **Security-Scoped Bookmarks**: 
  - Utilizes `WorkspaceAccess.swift` to resolve sandbox bookmarks.
  - Calls `URL.startAccessingSecurityScopedResource` and `URL.stopAccessingSecurityScopedResource` to manage access to files.

- **Access Control**:
  - Access is restricted to whitelisted directories, ensuring that file operations comply with macOS sandbox regulations.

- **Error Handling**:
  - Throws `accessDenied` or `permissionDenied` errors if folder access fails.

- **Persistence**:
  - Security bookmark data is persisted in database settings to maintain access across app launches.
