# NV32 (B)

## Answer

The AI chat stack works as follows:

- **Frontend Components**:
  - **Assistant Page**: `assistant.html` serves as the entry point.
  - **Chat Engine**: Implemented in `chat.ts`, includes components like `Chat`, `ChatInput`, and `ChatMessage`.
  - **3D Sphere**: Visualized using `Sphere` and related files (`sphere-microphone.ts`, `sphere-visibility.ts`).
  - **Voice Utilities**: Includes STT (Speech-to-Text) and TTS (Text-to-Speech) functionalities.

- **Backend Components**:
  - **AI Agents**: Managed server-side in the `server/agents/` directory, which includes various AI functionalities (e.g., verdict, trade review).
  - **AI Limits**: Controlled by `ai-limits.js` and `fm-ai-usage.js`, which track usage and enforce limits based on user tiers.

- **Memory Management**:
  - **Structured Memory RAG**: Handled by `structured-memory-prompt.js`, which syncs client memory for context in chat.

- **App Suite**:
  - **Command Palette**: Accessible via ⌘K, linking various tools and functionalities.

- **Data Management**:
  - **Firestore**: Used for workspace data.
  - **Supabase**: Manages subscriptions and AI usage tracking.

- **Development and Deployment**:
  - Built using Vite and TypeScript, with commands for development (`npm run dev`) and production builds (`npm run build`).

This stack integrates various components to provide a seamless AI chat experience, ensuring both frontend and backend functionalities work in harmony.
