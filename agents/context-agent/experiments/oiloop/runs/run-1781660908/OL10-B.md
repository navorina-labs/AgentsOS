# OL10 (B)

## Answer

The custom IMAP/SMTP mail client implementation in Oiloop is handled by the `CustomMailReader`. Here are the key features:

- **Protocol Support**: Utilizes `imaps://` for IMAP and `smtp://` for SMTP.
- **Fetching Inbox**: Executes curl subprocesses to fetch inbox headers using `FETCH BODY[HEADER]`.
- **Saving Drafts**: Saves drafts as temporary `.eml` files uploaded to the `imaps` Drafts folder.
- **Sending Mail**: Sends emails using SMTP with the `--mail-rcpt` option, supporting SSL if required.
