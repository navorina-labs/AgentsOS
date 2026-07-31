# OL10 (B)

## Answer

The custom IMAP/SMTP mail client implementation in Oiloop is handled by the `CustomMailReader`. Here are the key features:

- **Protocol Support**: 
  - Uses `imaps://` protocol for fetching inbox headers.
  - Uses `smtp://` protocol for sending emails.

- **Functionality**:
  - Executes curl subprocesses to interact with mail servers.
  - Fetches inbox headers using the command `FETCH BODY[HEADER]`.
  - Saves drafts as temporary `.eml` files uploaded to the `imaps` Drafts folder.
  - Sends emails using the `--mail-rcpt` option, with SSL if required.

- **Draft Management**:
  - Drafts are saved temporarily and managed through the custom implementation.

This implementation allows for direct interaction with mail servers without relying on Apple Mail.
