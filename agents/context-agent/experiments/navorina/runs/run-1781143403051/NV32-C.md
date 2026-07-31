# NV32 (C)

## Answer

The AI chat stack in the Navorina project consists of several key components and modules:

- **Entry Point**: 
  - `Navorina/assistant.html` serves as the main entry page for the assistant.

- **Chat Engine**: 
  - `Navorina/src/core/chat.ts` manages the chat functionalities, including sending and receiving messages.

- **3D Sphere**: 
  - `Navorina/src/components/Sphere.tsx` visualizes interactions in a 3D space.

- **Voice Utilities**: 
  - Includes speech-to-text (STT) and text-to-speech (TTS) functionalities for voice interactions.

- **Message Limits**: 
  - Handled by `Navorina/src/utils/message-limits.ts`, which sets restrictions on chat usage.

- **AI Agents**: 
  - Server-side AI functionalities are managed in the `server/agents/` directory, which includes various AI models and their configurations.

- **Structured Memory**: 
  - Managed by `Navorina/src/utils/nucleus-structured-memory-hub.ts`, this component allows for context retention and retrieval during conversations.

- **Prompts**: 
  - System prompts are defined in `Navorina/src/utils/prompts.ts`, guiding the AI's responses.

- **AI Usage Tracking**: 
  - `server/db/fm-ai-usage.js` tracks monthly AI call usage to enforce limits.

- **Dependencies**: 
  - The chat stack relies on other core modules such as `paywall-core` for feature access control and `nucleus-core` for context management.

This architecture allows for a cohesive interaction experience, integrating chat, voice, and AI functionalities while managing usage limits and context.
