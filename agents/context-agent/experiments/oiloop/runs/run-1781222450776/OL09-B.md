# OL09 (B)

## Answer

Oiloop reads inbox headers from Apple Mail through the following mechanism:

- Utilizes the `MailService` entity, which coordinates Apple Mail scripts.
- Implements AppleScript or JXA to interact with the Mail.app for reading inbox headers.
- Processes the retrieved headers for message triage classification.
