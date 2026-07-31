# MA38 (C)

## Answer

The verification JSON object returned by the `extract` function includes the following fields:

- `otp`: A string representing the one-time password, or `null` if not applicable.
- `links`: An array of strings containing extracted links.
- `primaryLink`: A string representing the primary link, or `null` if not applicable.
- `from`: A string indicating the sender's address.
- `subject`: A string representing the subject of the message.
- `messageId`: A string that uniquely identifies the message.
- `hasRaw`: A boolean indicating if there is a raw message available (optional).
- `rawUrl`: A string containing the URL to access the raw message, if applicable (optional).
