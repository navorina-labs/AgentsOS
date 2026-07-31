# OL07 (C)

## Answer

Oiloop enforces 'don't touch' rules through the following mechanisms:

- **UserRuleParser**: 
  - Parses natural language rules such as "don't touch [pattern]" and stores them in a memory store.
  - The `tryParseRule` function identifies and adds these rules to the memory.

- **RuleEnforcer**:
  - Contains methods like `shouldSkipFile`, `shouldSkipMail`, and `shouldSkipMessage` that check if a file, email, or message matches any 'don't touch' rules.
  - If a match is found, the corresponding action (e.g., moving a file) is skipped.

- **FileOrganizer**:
  - When proposing organization moves, it evaluates the user-defined rules to ensure that files matching 'don't touch' patterns are not moved.
  - The `proposeOrganization` function considers these rules during the organization process.

- **Audit Trail**:
  - Skipped folders or paths due to these rules are logged in an audit trail for transparency.

This combination ensures that user preferences regarding file handling are respected and enforced.
