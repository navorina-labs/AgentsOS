# OL02 (C)

## Answer

Oiloop compresses chat history to stay within token limits by following these steps:

- The `maybeCompressHistory` function is called at the end of the `executeCommand` in `ChatOrchestrator`.
- Compression is triggered when the threshold of 28 messages is reached, with a recent message window of 24 messages.
- It utilizes the `EpisodeSummarizer` to compress the oldest messages into `memory_episodes`.
- This process helps preserve prompt space for local LLMs.
