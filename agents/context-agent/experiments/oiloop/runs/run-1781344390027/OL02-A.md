# OL02 (A)

## Answer

Oiloop compresses chat history to stay within token limits by using the `EpisodeSummarizer` service, which performs the following steps:

- **Transcript Compilation**: It compiles the chat messages into a transcript, filtering out system messages.
- **Prompt Creation**: It creates a structured prompt for the language model (LLM) to summarize the chat, specifying the desired output format (title, topics, tone, summary).
- **LLM Interaction**: It sends the prompt to the LLM to generate a concise summary of the chat history.
- **Result Parsing**: The service parses the LLM's response to extract the title, topics, tone, and summary, ensuring the output is structured and within the token limits.

This process allows Oiloop to effectively condense chat history while maintaining essential information.
