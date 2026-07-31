# OL05 (B)

## Answer

Oiloop handles sandboxed folder access on macOS through the following mechanisms:

- **Security-Scoped Bookmarks**: 
  - Utilizes `WorkspaceAccess.swift` to resolve sandbox bookmarks.
  - Calls `URL.startAccessingSecurityScopedResource` and `URL.stopAccessingSecurityScopedResource` to manage access during file operations.

- **Bookmark Data Persistence**: 
  - Saves security bookmark data in the database settings to maintain access across app launches.

- **Error Handling**: 
  - Throws `accessDenied` or `permissionDenied` if folder access fails.

- **Validation**: 
  - Ensures all workspace file operations validate the target URL to confirm it resides within whitelisted bookmark directories.
