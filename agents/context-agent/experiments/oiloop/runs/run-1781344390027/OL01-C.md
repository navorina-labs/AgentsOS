# OL01 (C)

## Answer

Oiloop stores user preferences and chat history using the following methods:

- **MemoryStore**: Manages an SQLite database located inside the Application Support directory.
- **Database Tables**: Includes tables for sessions, messages, facts, and settings.
- **Local Storage**: Ensures that chat data remains strictly local on localhost.
- **Data Wiping**: User data can be completely wiped via the `wipeAll` method in `UserDataService`.
