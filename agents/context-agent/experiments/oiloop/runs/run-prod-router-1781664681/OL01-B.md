# OL01 (B)

## Answer

Oiloop stores user preferences and chat history using the following mechanisms:

- **User Preferences**:
  - Managed by the `PersonaSettings` entity, which includes fields for:
    - Assistant display name
    - User preferred name
    - Tone preset
    - Other configuration settings related to user interaction.

- **Chat History**:
  - Stored in a local SQLite database managed by the `MemoryStore` entity.
  - Chat sessions, messages, facts, and memory episodes are organized in tables within this database.
  - Memory episodes are compressed automatically to save context tokens when they reach a threshold of 28 messages, with a recent message window of 24.

This ensures that all user data remains local and private, adhering to the project's privacy invariants.
