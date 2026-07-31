# NV28 (B)

## Answer

The paywall upgrade CTA in Settings works as follows:

- **Plan Upgrade Flow**: Users can access the plan upgrade flow through the Settings interface.
- **Client Prompts**: The upgrade UI is managed by the `nucleus-paywall-prompt`, which is located in `Navorina/src/utils/nucleus-paywall-prompt.ts`.
- **Tier Display**: The current workspace context tier is displayed to users, allowing them to see their current plan and available upgrade options.
- **Pricing Pages**: Users can navigate to pricing pages (`subscribe.html`, `ru/subscribe.html`, `es/subscribe.html`) for more information on different tiers and features.

This process is supported by the server enforcement logic in `server/paywall/index.js` and the tier fetching from `server/db/user-subscription-tier.js`.
