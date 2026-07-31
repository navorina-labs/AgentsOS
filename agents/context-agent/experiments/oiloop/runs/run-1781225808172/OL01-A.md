# OL01 (A)

## Answer

Oiloop stores user preferences and chat history using the following methods:

- **User Preferences**:
  - Stored in a SQLite database via the `MemoryStore` class.
  - User settings are saved as Codable structures, such as `PresenceSettings`, `VoiceSettings`, `MailSettings`, etc.
  - Preferences are loaded and saved using the `DatabaseSettings` class, which handles both SQLite and legacy UserDefaults.

- **Chat History**:
  - Chat messages are stored in the SQLite database within the `messages` table.
  - Each message is associated with a session and includes details like role, content, and timestamp.
  - The `ChatOrchestrator` class manages the retrieval and storage of chat messages, ensuring they are appended to the history and can be summarized or processed as needed.

- **Audit Log**:
  - Actions taken by the user or the system are logged in an `audit_log` table, allowing for tracking of user interactions and system responses.

This structure allows Oiloop to maintain a persistent state across sessions while ensuring user data remains local and private.
