# OL02 (A)

## Answer

Oiloop compresses chat history to stay within token limits by using the following approach:

- **Episode Summarization**: It utilizes the `EpisodeSummarizer` to compress older chat messages into structured memory.
- **Threshold Check**: The system checks if the number of messages exceeds a defined threshold (e.g., `compressThreshold`).
- **Recent Message Retention**: It retains a certain number of recent messages (e.g., `keepRecent`) while compressing the older ones.
- **LLM Utilization**: The summarization is performed using a local LLM (Language Model) to generate a concise summary of the chat history.
- **Memory Insertion**: The summarized content is then inserted into memory as a new episode, allowing for efficient storage and retrieval while managing token usage effectively. 

This process ensures that Oiloop can maintain a manageable chat history without exceeding token limits during interactions.
