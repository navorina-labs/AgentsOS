# OL03 (C)

## Answer

The Oiloop assistant's system prompt is compiled and built in the following manner:

- **File**: `SystemPromptBuilder.swift` compiles the base prompt.
- **Template**: It reads the `SystemPrompt.txt` template from the application bundle.
- **Dynamic Content**: Recent memory episodes and user facts are appended dynamically.
- **Context Instructions**: Active Context Core instructions are filtered and attached if routing is enabled.
