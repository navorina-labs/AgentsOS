# OL07 (A)

## Answer

Oiloop enforces 'don't touch' rules through the following mechanisms:

- **User Rules**: The system maintains a list of user-defined rules, including 'don't touch' rules, which specify patterns or criteria for files that should not be modified or moved.
- **Rule Enforcement**: When a user requests file organization or cleanup, Oiloop checks the files against these rules. If a file matches a 'don't touch' rule, it is skipped during the organization process.
- **Memory Store**: The rules are stored in the MemoryStore, allowing Oiloop to access and apply them whenever file operations are initiated.
- **Feedback Mechanism**: Users are informed if any files were skipped due to these rules, ensuring transparency in the organization process.

This approach helps maintain user preferences and prevents unintended modifications to specified files.
