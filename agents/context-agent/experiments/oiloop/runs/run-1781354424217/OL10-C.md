# OL10 (C)

## Answer

The custom IMAP/SMTP mail client implementation in Oiloop is handled by the `CustomMailReader` class, which includes the following functionalities:

- **Fetching Inbox**:
  - Uses IMAP to fetch inbox messages.
  - Validates IMAP server, username, and password before fetching.
  - Retrieves message headers and snippets.

- **Saving Drafts**:
  - Constructs MIME format drafts and saves them to a specified drafts folder using IMAP.

- **Sending Mail**:
  - Sends emails via SMTP.
  - Validates SMTP server, username, and password before sending.
  - Constructs MIME format emails for sending.

- **Error Handling**:
  - Throws errors for missing configurations (IMAP/SMTP server, username, or password).

The `CustomMailReader` is designed to work with user-defined settings stored in `MailSettings`.
