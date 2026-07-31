# OL12 (A)

## Answer

Oiloop cannot directly send Apple Messages via an API because:

- **Apple's Restrictions**: Apple does not provide a public API for sending messages through the Messages app. This is a limitation imposed by Apple's privacy and security policies.
- **User Confirmation Requirement**: Oiloop is designed to operate with user confirmation for actions involving sending messages. It prepares drafts that the user must manually send, ensuring that no messages are sent without explicit user consent.
- **Use of IMAP/SMTP**: For custom mail functionality, Oiloop can use IMAP/SMTP protocols to send emails, but this does not extend to sending messages through the Messages app.
