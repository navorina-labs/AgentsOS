# OL07 (B)

## Answer

Oiloop enforces 'don't touch' rules through the following chain of processes:

- **UserRuleParser**: Parses natural language rules into SQLite `user_rules` with a specific kind of `dontTouch`.
- **RuleEnforcer**: Utilizes static methods (`shouldSkipFile`, `shouldSkipMail`, `shouldSkipMessage`) to determine if a file, mail, or message should be skipped based on the parsed rules.
- **FileOrganizer**: Calls `RuleEnforcer.shouldSkipFile` to skip any matching paths before proposing file moves.
- **MailService / MessagesService**: Filters messages using `shouldSkipMail` and `shouldSkipMessage` to avoid processing those that match the rules.
- **FilePreviewSheet**: Requires user confirmation for any proposed moves, ensuring no silent moves occur.
- **ScheduledDigestBuilder**: Includes a section in routine digests that lists active `dontTouch` rule patterns under "I'll avoid:".

This enforcement chain ensures that files or messages marked with 'don't touch' rules are not moved or processed without explicit user consent.
