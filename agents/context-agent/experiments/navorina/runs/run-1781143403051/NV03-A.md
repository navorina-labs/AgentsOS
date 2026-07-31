# NV03 (A)

## Answer

Monetization in Navorina works as follows:

- **Tiers**:
  - **Free Tier**: 
    - 1 snapshot per month
    - Basic Nucleus features
    - Access to tools
  - **Plus Tier**: 
    - Unlimited snapshots
    - AI brief
    - Export PDF functionality
  - **Pro Tier** (future):
    - Trading journal
    - Advanced AI features
    - Team functionalities
  - **B2B Tier** (future):
    - Multi-user support
    - Approval chains
    - API access

- **Implementation**:
  - The monetization process involves integrating with Stripe for payment processing.
  - Users can upgrade their subscriptions through a self-service model.
  - The system includes checks for subscription status and tier access.

- **Key Actions**:
  - `npm run setup:services-check` to verify Stripe integration.
  - Smoke tests for billing functionalities to ensure proper operation.

- **Future Plans**:
  - Additional features and pricing structures will be developed as the product matures.
