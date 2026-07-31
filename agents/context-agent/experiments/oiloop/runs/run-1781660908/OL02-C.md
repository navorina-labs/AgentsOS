# OL02 (C)

## Answer

Oiloop compresses chat history to stay within token limits by:

- Calling `maybeCompressHistory` at the end of `executeCommand` in `ChatOrchestrator`.
- Using a compression threshold of 28 messages, with a recent message window of 24.
- Invoking `EpisodeSummarizer` to compress the oldest messages into `memory_episodes`.
- Preserving prompt space for local LLMs.
