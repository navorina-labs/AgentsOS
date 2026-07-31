# OL10 (C)

## Answer

The custom IMAP/SMTP mail client implementation in Oiloop is handled by the `CustomMailReader` class, which includes the following functionalities:

- **Fetching Inbox**:
  - Uses IMAP to fetch headers of the most recent messages.
  - Validates IMAP server, username, and password before attempting to fetch messages.
  - Parses the fetched output into `MailMessageSummary` objects.

- **Saving Drafts**:
  - Constructs MIME format drafts and saves them to a specified drafts folder using IMAP.
  - Validates IMAP server, username, and password before saving drafts.

- **Sending Mail**:
  - Sends emails via SMTP.
  - Validates SMTP server, username, and password before sending.
  - Constructs MIME format emails for sending.

- **Error Handling**:
  - Throws errors if configurations (server, username, password) are missing or if fetching/sending fails.

The `CustomMailReader` is designed to work with user-defined settings stored in `MailSettings`, which include IMAP and SMTP configurations.
