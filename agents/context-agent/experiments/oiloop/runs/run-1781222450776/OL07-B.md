# OL07 (B)

## Answer

Oiloop enforces 'don't touch' rules through the following mechanism:

- **UserRuleParser**: Decodes custom text rules into SQLite format to prevent unwanted file moves.
- **Evaluation of User Rules**: The system evaluates user-defined rules (e.g., ignoring certain file patterns) to ensure compliance.
- **Invariants**: No files are moved without explicit user confirmation, ensuring that user rules are respected before any action is taken.
