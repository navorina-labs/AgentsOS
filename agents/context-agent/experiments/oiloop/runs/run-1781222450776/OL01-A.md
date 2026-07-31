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
  - The `ChatOrchestrator` class manages the chat history, allowing for retrieval and manipulation of messages.
  - The `MemoryStore` class provides methods to append messages and fetch them based on session IDs.

Overall, Oiloop utilizes a combination of SQLite for persistent storage and Codable structs for managing user preferences and chat history efficiently.
