# OL05 (B)

## Answer

Oiloop handles sandboxed folder access on macOS through the following steps:

1. **User Interaction**: The user selects a folder using `NSOpenPanel`.
2. **Bookmark Storage**: The selected folder's bookmark data is saved via the `DatabaseSettings` key `workspace_folder_bookmark`, and the display path is shown in `workspace_folder_path_display`.
3. **Bookmark Resolution**: The `WorkspaceAccess.withWorkspace` method resolves the bookmark and refreshes it if it is stale.
4. **Accessing Resources**: The method `URL.startAccessingSecurityScopedResource()` is called to begin accessing the security-scoped resource.
   - If this call returns false, an error `FileToolError.accessDenied` is raised.
5. **File Operations**: File operations are executed within the designated body, and `stopAccessingSecurityScopedResource` is called in a `defer` block to end access.
6. **Error Handling**: If the bookmark is missing, an error `FileToolError.workspaceNotConfigured` is raised. Additionally, attempts to write outside allowed paths result in `WorkspaceFileToolError.accessDenied(String)`.

This flow ensures compliance with macOS sandboxing requirements for file operations.
