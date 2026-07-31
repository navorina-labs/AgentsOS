# MA38 (B)

## Answer

The verification JSON object returned by extract is of type `MessageVerification`, which includes the following fields:

- `otp`: string or null
- `links`: array of strings
- `primaryLink`: string or null
- `from`: string
- `subject`: string
- `messageId`: string
- `hasRaw`: boolean (optional)
- `rawUrl`: string (optional, relative path)

This object serves as the source of truth for various API responses related to message verification.
