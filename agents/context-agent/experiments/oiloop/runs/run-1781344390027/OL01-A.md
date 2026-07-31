# OL01 (A)

## Answer

Oiloop stores user preferences and chat history using the following methods:

- **User Preferences:**
  - User preferences are stored in a SQLite database via the `MemoryStore` class.
  - Specific settings are saved using the `DatabaseSettings` class, which can load and save various settings like `PresenceSettings`, `VoiceSettings`, `MailSettings`, etc.
  - User preferences are also managed through Codable structures, allowing for easy serialization and deserialization.

- **Chat History:**
  - Chat history is stored in the same SQLite database, specifically in the `messages` table.
  - Each chat message is represented by the `ChatMessage` struct, which includes details such as the message ID, session ID, role (user or assistant), content, and timestamp.
  - The `ChatOrchestrator` class manages the chat messages, allowing for retrieval and manipulation of the chat history.

- **Audit Log:**
  - Actions related to user interactions and system events are logged in an `audit_log` table, which helps track user actions and system responses.

This structured approach ensures that user preferences and chat history are persistently stored and can be easily accessed or modified as needed.
