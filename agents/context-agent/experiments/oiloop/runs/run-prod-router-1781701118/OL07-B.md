# OL07 (B)

## Answer

Oiloop enforces 'don't touch' rules through the following chain:

1. **UserRuleParser**: Parses natural language rules into SQLite `user_rules` (specifically for `dontTouch`).
2. **RuleEnforcer**: 
   - Uses methods like `shouldSkipFile`, `shouldSkipMail`, and `shouldSkipMessage` to determine if a file or message should be skipped based on the parsed rules.
3. **FileOrganizer**: 
   - Calls `RuleEnforcer.shouldSkipFile` to skip matching paths before proposing file moves.
4. **MailService / MessagesService**: 
   - Filters messages using `shouldSkipMail` and `shouldSkipMessage`.
5. **FilePreviewSheet**: 
   - Requires user confirmation (Apply) for any proposed moves, ensuring no silent moves occur.
6. **ScheduledDigestBuilder**: 
   - Includes an "I'll avoid:" section in routine digests that lists active `dontTouch` rule patterns.

This process ensures that files or messages that match the 'don't touch' criteria are not moved or processed without explicit user confirmation.
