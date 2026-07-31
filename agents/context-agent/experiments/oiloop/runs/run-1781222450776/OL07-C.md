# OL07 (C)

## Answer

Oiloop enforces 'don't touch' rules through the following mechanisms:

- **UserRuleParser**: 
  - Parses natural language rules from chat input, such as "don't touch invoices".
  - Stores these rules in a `MemoryStore`.

- **RuleEnforcer**:
  - Contains methods to evaluate whether files, emails, or messages should be skipped based on the defined rules.
  - Specifically checks if the path, sender, or message body contains patterns defined in the 'don't touch' rules.

- **FileOrganizer**:
  - Proposes organization moves while respecting the 'don't touch' rules.
  - If a file matches a 'don't touch' rule, it will not be included in the proposed moves.

- **Audit Trail**:
  - Logs skipped folders or paths to maintain an audit of actions taken based on user rules.

These components work together to ensure that files matching the 'don't touch' criteria are not moved or organized.
