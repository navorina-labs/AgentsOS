# OL01 (A)

## Answer

Oiloop stores user preferences and chat history using the following methods:

- **User Preferences:**
  - Stored in a SQLite database via the `MemoryStore` class.
  - Preferences are loaded and saved using the `DatabaseSettings` struct, which handles encoding and decoding of settings to and from JSON.
  - Specific settings like `PresenceSettings`, `LocalLLMSettings`, and others are managed through dedicated structs that define their properties and provide methods for loading and saving.

- **Chat History:**
  - Chat messages are stored in the SQLite database within the `messages` table.
  - Each message is associated with a session and includes details such as the message role (user, assistant, system), content, and timestamp.
  - The `ChatOrchestrator` class manages the retrieval and storage of chat messages, ensuring they are appended to the history as conversations progress.

Overall, Oiloop utilizes a combination of SQLite for persistent storage and structured data models to manage user preferences and chat history effectively.
