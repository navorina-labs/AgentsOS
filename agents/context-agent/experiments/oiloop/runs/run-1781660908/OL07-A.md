# OL07 (A)

## Answer

The Oiloop project enforces 'don't touch' rules through the `UserRule` structure and the `userRules` functionality in the `MemoryStore`. Here are the key points:

- **UserRule Structure**: Represents a rule with a specific kind (e.g., `dontTouch`) and a pattern that defines what should not be modified or interacted with.

- **Rule Application**: The rules are stored in the database and can be fetched and applied during operations. When a user rule is defined as `dontTouch`, it prevents modifications to certain files or content based on the specified pattern.

- **MemoryStore Functions**: The `MemoryStore` class includes methods to manage user rules, allowing the application to check against these rules when processing commands or actions.

- **Proactive Monitoring**: The proactive service can monitor actions and ensure compliance with the defined rules, preventing any actions that would violate the 'don't touch' directive.

This combination of structures and services ensures that the rules are respected during the operation of the Oiloop application.
