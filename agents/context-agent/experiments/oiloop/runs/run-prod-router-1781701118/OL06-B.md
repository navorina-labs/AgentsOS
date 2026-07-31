# OL06 (B)

## Answer

When a user requests "organize downloads," the following steps occur:

1. **FileOrganizer** scans loose files and computes target category folders.
2. **FileOrganizeService** creates a plan proposing file movements.
3. **FilePreviewSheet** renders a SwiftUI preview of proposed moves.
4. Files move **only after** the user confirms (Apply moves).
