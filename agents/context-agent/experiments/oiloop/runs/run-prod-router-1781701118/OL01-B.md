# OL01 (B)

## Answer

Oiloop stores user preferences and chat history using the following mechanisms:

- **User Preferences**:
  - Managed by the `PersonaSettings` entity, which includes:
    - Assistant display name
    - User preferred name
    - Tone preset and other configuration settings
  - Stored in a local SQLite database via the `MemoryStore`.

- **Chat History**:
  - Chat sessions, messages, facts, and memory episodes are stored in the `MemoryStore`.
  - The `MemoryStore` handles CRUD operations for these entities, ensuring data is kept local on the device.
  - Chat history is compressed automatically into memory episodes when it reaches a threshold of 28 messages, preserving prompt space for local LLMs.
