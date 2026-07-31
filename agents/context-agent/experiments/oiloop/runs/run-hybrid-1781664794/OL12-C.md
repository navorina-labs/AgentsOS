# OL12 (C)

## Answer

Oiloop cannot directly send Apple Messages via an API due to the following reason:

- **Sandboxing restrictions on macOS** prevent direct API insertion of sent iMessages, requiring Oiloop to stage drafts on the system pasteboard/clipboard instead.
