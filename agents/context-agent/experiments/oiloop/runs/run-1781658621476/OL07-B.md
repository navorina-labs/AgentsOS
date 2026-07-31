# OL07 (B)

## Answer

Oiloop enforces 'don't touch' rules through the following mechanisms:

- **UserRuleParser**: 
  - Parses plain text rules containing "don't touch" patterns.
  - Persists these rules in the SQLite `user_rules` table.

- **FileOrganizer**: 
  - Checks the parsed rules to determine if a file should be skipped before proposing moves.

- **Rule Enforcers**: 
  - Utilize the `shouldSkipFile` function to evaluate if a file matches any 'don't touch' rules.

- **Scheduled Digest Warnings**: 
  - Rules are matched in scheduled digest warnings to ensure compliance.

- **Audit Trail**: 
  - Skipped folders/paths are logged in the audit trail for accountability.
