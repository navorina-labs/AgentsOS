# OL10 (C)

## Answer

The custom IMAP/SMTP mail client implementation in Oiloop is handled by the `CustomMailReader` class, which includes the following functionalities:

- **Fetching Inbox**:
  - Uses IMAP to fetch headers of the most recent messages.
  - Validates IMAP server, username, and password before attempting to fetch.
  - Returns an array of `MailMessageSummary` objects.

- **Saving Drafts**:
  - Constructs MIME format drafts and saves them to a specified drafts folder using IMAP.
  - Validates IMAP server, username, and password before saving.

- **Sending Mail**:
  - Sends emails via SMTP.
  - Validates SMTP server, username, and password before sending.
  - Constructs MIME format for the email and uses curl to send it.

- **Error Handling**:
  - Throws errors if configurations (server, username, password) are missing or if fetching fails.

The `CustomMailReader` is designed to work with user-defined settings stored in `MailSettings`, which include IMAP and SMTP configurations.
