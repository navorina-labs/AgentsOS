# OL02 (B)

## Answer

Oiloop compresses chat history using the following method:

- The `maybeCompressHistory` function is called at the end of the `executeCommand` in `ChatOrchestrator`.
- It compresses the oldest messages into `memory_episodes` using the `EpisodeSummarizer`.
- The compression is triggered when the threshold of 28 messages is reached.
- A recent message window of 24 messages is preserved to maintain context.
