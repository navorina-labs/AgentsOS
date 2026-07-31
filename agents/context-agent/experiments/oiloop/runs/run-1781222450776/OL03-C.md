# OL03 (C)

## Answer

The Oiloop assistant's system prompt is compiled and built in the following way:

- **File**: `SystemPromptBuilder.swift`
- **Process**:
  - It reads the `SystemPrompt.txt` template from the bundle.
  - It appends recent memory episodes and user facts dynamically.
  - It filters and attaches active Context Core instructions if routing is enabled.
