# OL02 (A)

## Answer

Oiloop compresses chat history to stay within token limits by using the following approach:

- **Episodic Memory**: It summarizes chat excerpts into structured memory.
- **Summarization Process**:
  - It generates a concise summary, listing main topics discussed and key action items.
  - The summary includes a title, topics, tone, and a detailed summary of the discussion.
- **Token Management**: The summarization ensures that the content is factual and brief, which helps in reducing the overall token count.
- **Use of LLM**: The summarization is performed using a local language model (LLM) that processes the chat history and outputs a compressed version.

This method allows Oiloop to effectively manage and reduce the amount of text stored, ensuring it remains within the token limits for processing.
