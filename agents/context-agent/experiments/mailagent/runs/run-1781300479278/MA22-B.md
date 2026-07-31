# MA22 (B)

## Answer

- Business logic is located in the **services layer** (`src/services/*.ts`).
- Services handle operations related to:
  - Database interactions (e.g., Neon SQL)
  - External APIs (e.g., Resend API)
  - Workers AI functionalities
- HTTP handlers (routes) are thin and primarily responsible for:
  - Authentication
  - Validation
  - JSON formatting
- Services are invoked directly from routes, queue consumers, and MCP handlers without HTTP loopback.
