# OL03 (C)

## Answer

The Oiloop assistant's system prompt is compiled and built in the following way:

- **File**: `SystemPromptBuilder.swift`
  - Compiles the base prompt.
  - Reads the `SystemPrompt.txt` template from the bundle.
  - Appends recent memory episodes and user facts dynamically.
  - Filters and attaches active Context Core instructions if routing is enabled.
