# OL05 (B)

## Answer

Oiloop handles sandboxed folder access on macOS through the following mechanisms:

- **WorkspaceAccess Entity**: This entity persists and resolves sandbox bookmark security data, allowing file operations while complying with macOS sandbox regulations.
- **Sandboxed Folder Bookmarks Decision**: A decision was made to use sandboxed folder bookmarks to enable file operations within the constraints of macOS sandboxing (Decision ADR-02).
- **Invariants**: File moves must only occur within whitelisted bookmark directories, ensuring that operations are secure and compliant with sandbox rules.
