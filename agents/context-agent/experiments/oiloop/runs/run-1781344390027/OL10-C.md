# OL10 (C)

## Answer

The custom IMAP/SMTP mail client implementation in Oiloop is handled by the `CustomMailReader` class, which includes the following functionalities:

- **Fetching Inbox**:
  - Uses IMAP to fetch inbox messages based on user settings.
  - Validates that the IMAP server, username, and password are configured.
  - Retrieves message headers and body snippets.

- **Saving Drafts**:
  - Constructs MIME format drafts and saves them to the specified drafts folder in IMAP.
  - Validates the IMAP configuration before saving.

- **Sending Mail**:
  - Sends emails via SMTP using user-provided settings.
  - Validates SMTP server, username, and password before sending.
  - Constructs MIME format for the email and handles attachments if necessary.

- **Error Handling**:
  - Throws errors for missing configurations or failures in fetching/sending emails.

The `CustomMailReader` is designed to work with user-defined settings stored in `MailSettings`, which include IMAP and SMTP configurations.
