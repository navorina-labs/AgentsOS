# OL07 (C)

## Answer

Oiloop enforces 'don't touch' rules through the following mechanisms:

- **UserRuleParser**: 
  - Parses natural language rules from chat, such as "don't touch invoices".
  - Stores these rules in a `MemoryStore`.

- **RuleEnforcer**:
  - Contains methods to check if files, emails, or messages should be skipped based on the defined rules.
  - Specifically, it checks if the path, sender, or message body contains any patterns defined in the 'don't touch' rules.

- **FileOrganizer**:
  - Proposes organization moves while respecting the 'don't touch' rules.
  - If a file matches a 'don't touch' rule, it will not be included in the proposed moves.

- **Audit Trail**:
  - Skipped folders or paths due to these rules are logged in an audit trail for transparency.

This ensures that files matching the specified patterns are not moved or organized, adhering to user preferences.
