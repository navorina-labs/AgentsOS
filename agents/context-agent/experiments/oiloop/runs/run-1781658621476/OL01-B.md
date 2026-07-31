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
  - Chat sessions, messages, and memory episodes are stored in the SQLite database managed by the `MemoryStore`.
  - Memory schemas allow for CRUD operations on sessions, messages, facts, and episodes.
  - Chat history is compressed automatically when it reaches a threshold of 28 messages to save context tokens, using the `EpisodeSummarizer`.
