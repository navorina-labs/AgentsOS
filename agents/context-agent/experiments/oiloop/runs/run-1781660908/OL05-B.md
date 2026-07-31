# OL05 (B)

## Answer

Oiloop handles sandboxed folder access on macOS through the following steps:

1. **User Selection**: The user picks a folder using `NSOpenPanel`.
2. **Bookmark Saving**: The selected folder's bookmark data is saved via the `DatabaseSettings` key `workspace_folder_bookmark`, and the display path is shown in `workspace_folder_path_display`.
3. **Bookmark Resolution**: The `WorkspaceAccess.withWorkspace` method resolves the bookmark and refreshes it if stale.
4. **Accessing Resource**: The method `URL.startAccessingSecurityScopedResource()` is called to gain access to the folder.
   - If access fails, it returns `FileToolError.accessDenied`.
5. **File Operations**: File operations are executed within the `body` of the access block, and `stopAccessingSecurityScopedResource` is called in a `defer` statement to ensure proper cleanup.
6. **Error Handling**: If the bookmark is missing, it returns `FileToolError.workspaceNotConfigured`. Additionally, any attempts to write outside allowed paths result in `WorkspaceFileToolError.accessDenied(String)`.

This process ensures compliance with macOS sandboxing requirements for file operations.
