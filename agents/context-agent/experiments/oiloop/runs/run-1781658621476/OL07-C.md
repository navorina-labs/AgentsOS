# OL07 (C)

## Answer

Oiloop enforces 'don't touch' rules through the following mechanisms:

- **UserRuleParser**: 
  - Parses natural language rules that include "don't touch" commands.
  - Stores these rules in the SQLite `user_rules` table.

- **RuleEnforcer**:
  - Contains methods to check if files, emails, or messages should be skipped based on the 'don't touch' rules.
  - Specifically, the method `shouldSkipFile` checks if a file path contains any patterns defined in the rules.

- **FileOrganizer**:
  - Before proposing file movements, it checks against the rules using the `shouldSkipFile` method to ensure that files matching 'don't touch' patterns are not moved.

- **User Confirmation**:
  - No files are moved without explicit user confirmation via the `FilePreviewSheet`, which displays pending moves and allows users to apply or cancel them.

These components work together to ensure that specified files are not moved or organized if they match the defined 'don't touch' criteria.
