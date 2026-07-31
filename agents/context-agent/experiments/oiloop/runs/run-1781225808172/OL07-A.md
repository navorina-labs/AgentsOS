# OL07 (A)

## Answer

Oiloop enforces 'don't touch' rules through the following mechanisms:

- **User Rule Definition**: Users can define rules that specify which files should not be moved or organized. These rules are categorized under the `dontTouch` kind.

- **Rule Checking**: When a file operation is requested, Oiloop checks the file paths against the defined 'don't touch' rules. If a file path matches any of the patterns specified in these rules, the operation is skipped for that file.

- **Rule Enforcer**: The `RuleEnforcer` class contains methods that evaluate whether a file, email, or message should be skipped based on the defined rules. It checks the sender, subject, and content against the patterns in the rules.

- **Feedback Mechanism**: If a file is identified as matching a 'don't touch' rule, Oiloop will not perform any actions on that file, ensuring that user preferences are respected.
