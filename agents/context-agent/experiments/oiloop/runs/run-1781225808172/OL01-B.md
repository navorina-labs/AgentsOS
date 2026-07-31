# OL01 (B)

## Answer

Oiloop stores user preferences and chat history using the following methods:

- **Local SQLite Database**: 
  - Managed by the `MemoryStore`, which handles tables for messages, facts, episodes, and settings.
  
- **Key Entities**:
  - `PersonaSettings`: Stores preferred names and assistant character configuration.
  - `OnboardingSettings`: Manages onboarding state and checks.

- **Memory Schemas**: 
  - Supports CRUD operations for sessions, messages, facts, and episodes to maintain user data.

- **Data Privacy**: 
  - User chat data remains local, with no cloud keys or logs, ensuring privacy.
