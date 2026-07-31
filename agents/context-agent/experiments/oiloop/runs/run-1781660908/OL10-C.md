# OL10 (C)

## Answer

The custom IMAP/SMTP mail client implementation in Oiloop is handled by the `CustomMailReader`. Here are the key details:

- **Functionality**:
  - Executes curl subprocesses for IMAP and SMTP.
  - Fetches inbox using the `imaps://` protocol and `FETCH BODY[HEADER]`.
  - Saves drafts using temporary `.eml` files uploaded to the IMAP Drafts folder.
  - Sends mail using the `smtp://` protocol and `--mail-rcpt` (with SSL if required).

- **Integration**:
  - Works in conjunction with `MailSettings` to configure IMAP/SMTP settings.
  - Can be toggled on or off based on user preferences in the settings.

- **Error Handling**:
  - Throws errors if SMTP server, username, or password is not configured properly.

This implementation allows Oiloop to interact with custom mail servers beyond the default Apple Mail functionality.
