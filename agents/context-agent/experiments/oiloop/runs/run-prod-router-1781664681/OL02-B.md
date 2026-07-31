# OL02 (B)

## Answer

Oiloop compresses chat history using the following method:

- The `maybeCompressHistory` function is called at the end of the `executeCommand` in `ChatOrchestrator`.
- It compresses the oldest messages into `memory_episodes` using the `EpisodeSummarizer`.
- The compression threshold is set to 28 messages, with a recent message window of 24 messages.
