# OL02 (A)

## Answer

Oiloop compresses chat history to stay within token limits by using the `EpisodeSummarizer` service, which performs the following steps:

- **Transcript Creation**: It compiles the chat messages into a transcript, filtering out system messages.
- **Prompt Construction**: It constructs a prompt for the language model (LLM) that instructs it to summarize the chat excerpt for long-term memory, specifying the desired format for the output.
- **LLM Interaction**: The constructed prompt is sent to the LLM, which generates a structured summary that includes:
  - Title
  - Topics
  - Tone
  - Summary
- **Result Parsing**: The generated summary is parsed to extract the title, topics, tone, and summary for storage.

This process ensures that the chat history is effectively compressed into a concise format suitable for memory storage while adhering to token limits.
