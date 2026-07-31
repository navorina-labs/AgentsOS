# OL07 (C)

## Answer

Oiloop enforces 'don't touch' rules through the following mechanisms:

- **UserRuleParser**: 
  - Parses natural language rules from chat input, such as "don't touch invoices".
  - Stores these rules in a `MemoryStore`.

- **RuleEnforcer**:
  - Contains methods to evaluate whether files, emails, or messages should be skipped based on the defined rules.
  - Specifically checks if the path, sender, or message body contains any patterns defined in the 'don't touch' rules.

- **FileOrganizer**:
  - When proposing file organization, it respects the 'don't touch' rules by ensuring that files matching these patterns are not moved.

- **Audit Trail**:
  - Skipped folders or paths due to these rules are logged in an audit trail for transparency.

This combination ensures that files matching the 'don't touch' criteria are not moved or organized, adhering to user preferences.
