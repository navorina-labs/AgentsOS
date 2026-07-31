# OL04 (C)

## Answer

The tone presets supported by Oiloop are:

- **Warm**: Gentle, human, still concise.
- **Professional**: Clear, neutral.
- **Minimal**: Very short answers.

These presets are defined in the `PersonaSettings` which includes the `TonePreset` enum. They are mapped in `SystemPromptBuilder` to affect the LLM style, and the settings screen allows user selection.
