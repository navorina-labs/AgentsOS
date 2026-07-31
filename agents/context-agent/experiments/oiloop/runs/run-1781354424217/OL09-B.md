# OL09 (B)

## Answer

Oiloop reads inbox headers from Apple Mail through the following mechanism:

- Utilizes the `MailService` entity.
- Coordinates Apple Mail scripts and SMTP/IMAP network requests to fetch inbox headers.
- Implements custom IMAP fetching protocols to retrieve the necessary data.
