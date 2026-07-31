# OL07 (C)

## Answer

Oiloop enforces 'don't touch' rules through the following process:

- **UserRuleParser**: Parses natural language rules into SQLite `user_rules` with the kind set to `dontTouch`.
- **RuleEnforcer**: Contains static methods (`shouldSkipFile`, `shouldSkipMail`, `shouldSkipMessage`) that check if a file, email, or message should be skipped based on the defined rules.
- **FileOrganizer**: Calls `RuleEnforcer.shouldSkipFile` to skip proposing moves for files that match the 'don't touch' rules.
- **MailService / MessagesService**: Uses `shouldSkipMail` and `shouldSkipMessage` to filter out emails and messages that match the rules.
- **FilePreviewSheet**: Requires user confirmation for any proposed file moves, ensuring no silent moves occur.
- **ScheduledDigestBuilder**: Includes a section in routine digests that lists active 'don't touch' rule patterns.

This enforcement chain ensures that files matching the 'don't touch' criteria are not moved or processed without explicit user consent.
