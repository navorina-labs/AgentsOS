# OL07 (A)

## Answer

Oiloop enforces 'don't touch' rules through the following mechanisms:

- **User Rules**: Users can define rules that specify which files should not be moved or organized. These rules are stored in the memory database.
  
- **Rule Checking**: When a file operation is requested, Oiloop checks the file paths against the defined 'don't touch' rules. If a file path matches any of the patterns specified in these rules, the operation is skipped for that file.

- **Rule Enforcer**: The `RuleEnforcer` class contains methods that evaluate whether a file, email, or message should be skipped based on the defined rules. It checks the sender, subject, and content against the patterns in the rules.

- **Feedback**: If a file is skipped due to a 'don't touch' rule, the user is informed that the file will not be moved or organized according to their specified preferences. 

This ensures that users have control over which files are protected from being altered by the application.
