# OL03 (A)

## Answer

The Oiloop assistant's system prompt is compiled and built in the `SystemPromptBuilder` enum. It constructs the system message using the `build` method, which combines a base prompt with settings, facts, rules, episodes, and active context cores. The base prompt is loaded from a text file using the `loadBasePrompt` method.
