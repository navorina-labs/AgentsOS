# OL03 (C)

## Answer

The Oiloop assistant's system prompt is compiled and built in the following manner:

- **File**: `SystemPromptBuilder.swift` compiles the base prompt.
- **Template**: Reads `SystemPrompt.txt` template from the application bundle.
- **Dynamic Content**: Appends recent memory episodes and user facts dynamically.
- **Context Instructions**: Filters and attaches active Context Core instructions if routing is enabled.
