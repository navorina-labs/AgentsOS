# NV31 (B)

## Answer

Assistant AI usage limits are defined in the following context:

- **File**: `ai-limits.js`
- **Function**: Sets per-agent limits based on user tiers.
- **Tracking**: Monthly AI call tracking is managed by `fm-ai-usage.js`.
- **Error Handling**: For limits errors, users should check their tier and the `fm-ai-usage` data.

These limits are enforced server-side and are crucial for managing resource usage across different subscription tiers.
