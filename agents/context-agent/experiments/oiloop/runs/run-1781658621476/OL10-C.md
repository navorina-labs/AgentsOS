# OL10 (C)

## Answer

The custom IMAP/SMTP mail client implementation in Oiloop is handled by the `CustomMailReader`. Here are the key details:

- **Functionality**:
  - Executes curl subprocesses for IMAP and SMTP.
  - Fetches inbox using the `imaps://` protocol and `FETCH BODY[HEADER]`.
  - Saves drafts using temporary `.eml` files uploaded to the IMAP Drafts folder.
  - Sends mail using the `smtp://` protocol and `--mail-rcpt` (with SSL if required).

- **Integration**:
  - Works in conjunction with `MailService` for coordinating email automation.
  - Can be toggled on or off in the MailSettings.

- **Usage**:
  - If `useCustomMail` is enabled in `MailSettings`, the `CustomMailReader` is utilized for fetching and sending emails.
