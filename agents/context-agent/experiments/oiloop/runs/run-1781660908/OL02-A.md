# OL02 (A)

## Answer

Oiloop compresses chat history to stay within token limits by using the following approach:

- **Episodic Memory**: It summarizes chat history into structured memory episodes.
- **Summarization Process**: The summarization includes:
  - **Title**: A short title describing the meeting or chat.
  - **Topics**: A list of comma-separated topics discussed.
  - **Tone**: A single word indicating the tone (e.g., calm, focused).
  - **Summary**: A concise summary of the discussion and outcomes.
- **Action Items**: It also lists action items with assignees if mentioned.
- **Prompt Structure**: The summarization is guided by a structured prompt that instructs the model to be factual and brief, ensuring that the output remains concise and within token limits.

This method allows Oiloop to effectively manage and compress chat history while retaining essential information.
