# OL01 (A)

## Answer

Oiloop stores user preferences and chat history using the following methods:

- **User Preferences:**
  - User preferences are stored in a SQLite database via the `MemoryStore` class.
  - Specific settings are saved using the `DatabaseSettings` class, which can load and save various configurations (e.g., `PresenceSettings`, `VoiceSettings`, `MailSettings`, etc.).
  - User preferences are also managed through Codable structs, allowing for easy serialization and deserialization.

- **Chat History:**
  - Chat messages are stored in the SQLite database within the `messages` table.
  - Each message is associated with a session and includes details such as the message role (user, assistant, system), content, and timestamp.
  - The `ChatOrchestrator` class manages the retrieval and storage of chat messages, ensuring that they are appended to the history and can be queried as needed.

- **Audit Log:**
  - Actions taken within the application (like sending messages or organizing files) are logged in an audit log, which is also stored in the SQLite database. This log can be accessed for review and tracking user interactions.
