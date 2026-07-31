# OL02 (A)

## Answer

Oiloop compresses chat history to stay within token limits by using the following approach:

- **Episode Summarization**: It summarizes older chat messages into episodic memory using the `EpisodeSummarizer` class.
- **Thresholds**: It maintains a `compressThreshold` to determine when to compress history. If the number of messages exceeds this threshold, it triggers compression.
- **Recent Message Window**: It keeps a recent message window (e.g., the last 20 messages) while compressing older messages.
- **LLM Utilization**: It uses a local language model (LLM) to generate concise summaries of the chat history, ensuring that the output is factual and brief.
- **Automatic Compression**: The system automatically compresses chat history when certain conditions are met, such as having enough messages and exceeding the defined threshold.

This process helps manage the amount of data retained while ensuring that important information is still accessible.
