# MA22 (B)

## Answer

- Business logic is located in the **services layer** (`src/services/*.ts`).
- Services handle operations related to:
  - Database interactions (e.g., Neon SQL)
  - External APIs (e.g., Resend API)
  - Workers AI functionalities
- Routes (`src/routes/*.ts`) are thin and primarily handle:
  - HTTP request parsing (query, body, headers)
  - Authentication and validation
  - Mapping service errors to HTTP responses
  - Formatting JSON responses
