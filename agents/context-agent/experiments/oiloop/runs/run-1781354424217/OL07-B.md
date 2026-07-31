# OL07 (B)

## Answer

Oiloop enforces 'don't touch' rules through the following mechanisms:

- **UserRuleParser**: Decodes custom text rules into SQLite format to prevent unwanted file moves.
- **Evaluation of User Rules**: The system evaluates user-defined rules (e.g., ignoring certain file patterns) during file organization processes.
- **Invariants**: Ensures that no files are moved without explicit user confirmation, adhering to the defined rules.
