# OL07 (C)

## Answer

Oiloop enforces 'don't touch' rules through the following chain:

1. **UserRuleParser**: Parses natural language rules into SQLite `user_rules` with the kind set to `dontTouch`.
2. **RuleEnforcer**: 
   - Uses static methods (`shouldSkipFile`, `shouldSkipMail`, `shouldSkipMessage`) to check if a file, email, or message should be skipped based on the rules.
3. **FileOrganizer**: 
   - Calls `RuleEnforcer.shouldSkipFile` to skip proposing moves for files that match the 'don't touch' rules.
4. **MailService / MessagesService**: 
   - Filters incoming messages and emails using `shouldSkipMail` and `shouldSkipMessage` to avoid processing those that match the rules.
5. **FilePreviewSheet**: 
   - Requires user confirmation for any proposed file moves, ensuring no files are moved silently.
6. **ScheduledDigestBuilder**: 
   - Includes a section in routine digests that lists active 'don't touch' rule patterns, reminding users of the rules in effect.

This enforcement chain ensures that files matching the 'don't touch' criteria are not moved or processed without explicit user consent.
