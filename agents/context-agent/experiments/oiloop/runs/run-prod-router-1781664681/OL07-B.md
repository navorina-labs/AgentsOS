# OL07 (B)

## Answer

Oiloop enforces 'don't touch' rules through the following chain of components:

- **UserRuleParser**: Parses natural language rules into SQLite `user_rules` with a `dontTouch` kind.
- **RuleEnforcer**: 
  - Contains static methods: `shouldSkipFile`, `shouldSkipMail`, and `shouldSkipMessage` to determine if a file, mail, or message should be skipped based on user-defined rules.
- **FileOrganizer**: 
  - Calls `RuleEnforcer.shouldSkipFile` to skip matching paths before proposing file moves.
- **MailService / MessagesService**: 
  - Filters messages using `shouldSkipMail` and `shouldSkipMessage` to avoid processing unwanted items.
- **FilePreviewSheet**: 
  - Requires user confirmation (Apply / Cancel) for any proposed file moves, ensuring no silent moves occur.
- **ScheduledDigestBuilder**: 
  - Includes a section in routine digests that lists active `dontTouch` rule patterns, keeping users informed.

This enforcement chain ensures that files and messages that match the 'don't touch' criteria are not moved or processed without explicit user consent.
