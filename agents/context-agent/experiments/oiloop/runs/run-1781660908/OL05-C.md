# OL05 (C)

## Answer

Oiloop handles sandboxed folder access on macOS through the following steps:

1. **User Selection**:
   - The user selects a folder via `NSOpenPanel`.
   - The bookmark data is saved using the `DatabaseSettings` key `workspace_folder_bookmark`.

2. **Bookmark Resolution**:
   - The `WorkspaceAccess.withWorkspace` method resolves the bookmark, refreshing it if it is stale.

3. **Accessing Security-Scoped Resources**:
   - The method `URL.startAccessingSecurityScopedResource()` is called to gain access to the folder.
   - If access fails, it returns `FileToolError.accessDenied`.

4. **File Operations**:
   - File operations are executed within a closure, and `stopAccessingSecurityScopedResource` is called in a `defer` block to ensure it is called after the operations complete.

5. **Error Handling**:
   - If the bookmark is missing, it returns `FileToolError.workspaceNotConfigured`.
   - Any attempts to write outside allowed paths result in `WorkspaceFileToolError.accessDenied(String)`.

This process ensures that file operations are compliant with macOS sandboxing requirements while maintaining user control and security.
