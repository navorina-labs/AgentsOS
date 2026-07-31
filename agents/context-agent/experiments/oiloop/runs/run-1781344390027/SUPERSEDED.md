# Superseded Run

This run (`run-1781344390027`) has been superseded by `run-1781354424217` on 2026-06-13.
The reason: `OL08` achieved `B accuracy = 0` due to a missing SwiftUI view description in the `workspace-core` metadata.
After patching `workspace-core` content to include `FilePreviewSheet` references, the re-run successfully elevated `OL08` B accuracy to `3`.
