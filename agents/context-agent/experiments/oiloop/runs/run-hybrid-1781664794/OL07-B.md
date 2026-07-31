# OL07 (B)

## Answer

Oiloop enforces 'don't touch' rules through the following chain of processes:

- **UserRuleParser**: Parses natural language rules into SQLite `user_rules` with a specific kind (`dontTouch`).
- **RuleEnforcer**: 
  - Contains static methods (`shouldSkipFile`, `shouldSkipMail`, `shouldSkipMessage`) to determine if a file, mail, or message should be skipped based on the parsed rules.
- **FileOrganizer**: 
  - Calls `RuleEnforcer.shouldSkipFile` to skip matching paths before proposing file moves.
- **MailService / MessagesService**: 
  - Filters messages using `shouldSkipMail` and `shouldSkipMessage` to avoid processing those that match the rules.
- **FilePreviewSheet**: 
  - Requires user confirmation (Apply / Cancel) for any proposed file moves, ensuring no silent moves occur.
- **ScheduledDigestBuilder**: 
  - Includes a section in routine digests that lists active `dontTouch` rule patterns, keeping users informed.

This enforcement chain ensures that files or messages that match the 'don't touch' criteria are not moved or processed without explicit user consent.
