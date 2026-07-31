# OL01 (A)

## Answer

Oiloop stores user preferences and chat history using the following methods:

- **User Preferences:**
  - Preferences are stored in a SQLite database via the `MemoryStore` class.
  - Specific settings are loaded and saved using the `DatabaseSettings` class, which handles both SQLite and legacy UserDefaults.
  - User preferences include settings for voice, presence, proactive features, and more, encapsulated in various structs like `PersonaSettings`, `MailSettings`, `MessagesSettings`, etc.

- **Chat History:**
  - Chat messages are stored in the `messages` table of the SQLite database.
  - Each message is associated with a session and includes details such as the message role (user, assistant, system), content, and timestamp.
  - The `ChatOrchestrator` class manages the retrieval and storage of chat messages, ensuring they are appended to the history as conversations progress.

- **Audit Log:**
  - Actions taken by the user or the system are logged in an `audit_log` table, which helps track user interactions and system responses.

This structured approach allows Oiloop to maintain a comprehensive record of user interactions and preferences while ensuring data persistence across sessions.
