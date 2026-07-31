# OL07 (A)

## Answer

Oiloop enforces 'don't touch' rules through the following mechanisms:

- **User Rules**: The system maintains a list of user-defined rules, including 'don't touch' rules, which specify files or conditions that should not be altered.
- **Rule Checking**: When a user command is processed, the system checks the incoming message against these rules to determine if any actions would violate them.
- **Filtering**: If a command matches a 'don't touch' rule, the system will skip or prevent any actions that would affect the specified files or conditions.
- **Audit Logging**: Actions taken or skipped due to these rules are logged for transparency and user awareness.

This ensures that user preferences regarding file management are respected during interactions with the assistant.
