# MA38 (A)

## Answer

The verification JSON object returned by the extract endpoint includes the following fields:

```json
{
  "otp": "string | null",          // The one-time password extracted from the latest message, or null if not available.
  "links": ["string"],             // An array of links extracted from the latest message.
  "primaryLink": "string | null",  // The primary link extracted, or null if not available.
  "from": "string",                // The sender's email address.
  "subject": "string",             // The subject of the email.
  "messageId": "string"            // The unique identifier of the message.
}
```

This structure allows the user to access the OTP, any links, and other relevant information from the verification email.
