# OL01 (A)

## Answer

Oiloop stores user preferences and chat history using the following methods:

- **User Preferences:**
  - Stored in a SQLite database via the `MemoryStore` class.
  - Preferences are loaded and saved using the `DatabaseSettings` class, which can handle various types of settings (e.g., `PresenceSettings`, `LocalLLMSettings`).
  - User preferences can include settings for voice, presence, and other application configurations.

- **Chat History:**
  - Chat messages are stored in the SQLite database within the `messages` table.
  - Each message is associated with a session and includes details such as the message role (user, assistant, system), content, and timestamp.
  - The `ChatOrchestrator` class manages the retrieval and storage of chat messages, ensuring they are appended to the session history.

- **Episodic Memory:**
  - Oiloop also maintains episodic memory through the `MemoryEpisode` structure, which captures summaries of chat sessions for long-term storage.
  - This episodic memory is also stored in the SQLite database and can be queried for insights and context in future interactions.
