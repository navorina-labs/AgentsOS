# OL07 (D)

## Answer

Oiloop enforces 'don't touch' rules through the following chain of operations:

- **UserRuleParser**: Parses natural language rules into SQLite `user_rules` with a specific kind of `dontTouch`.
- **RuleEnforcer**: 
  - Contains static methods (`shouldSkipFile`, `shouldSkipMail`, `shouldSkipMessage`) that check if a file, email, or message matches any `dontTouch` rules.
- **FileOrganizer**: 
  - Calls `RuleEnforcer.shouldSkipFile` to skip proposing moves for files that match the `dontTouch` rules.
- **MailService / MessagesService**: 
  - Filters incoming emails and messages using `shouldSkipMail` and `shouldSkipMessage` to avoid processing those that match `dontTouch` rules.
- **FilePreviewSheet**: 
  - Requires user confirmation for any proposed file moves, ensuring no silent moves occur.
- **ScheduledDigestBuilder**: 
  - Includes a section in routine digests that lists active `dontTouch` rule patterns, keeping users informed.

This enforcement chain ensures that files or messages that match the specified rules are not moved or processed without explicit user consent.
