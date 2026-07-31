# MA23 (B)

## Answer

The sender allowlist works as follows:

- **Configuration**: 
  - Set during inbox creation using `allowed_senders`, `expectFrom`, and `service` presets.
  
- **Validation**: 
  - The function `isSenderAllowed()` checks incoming messages against the allowlist.
  
- **Action on Non-Matching Senders**: 
  - Messages from senders not on the allowlist are dropped and not stored.
