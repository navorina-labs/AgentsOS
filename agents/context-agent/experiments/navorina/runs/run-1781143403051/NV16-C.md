# NV16 (C)

## Answer

The Financial Mirror operates as a module within the Navorina project, managing income, expenses, and snapshots. Here’s a concise overview of its functionality:

- **Core Functions**:
  - Manages user financial data, including income sources and expenses.
  - Allows users to create, save, and load financial snapshots.
  - Integrates with Firestore for data persistence.

- **User Interaction**:
  - Users can view and manage their financial data through a dashboard interface.
  - Supports guest mode, allowing temporary access without user authentication.

- **Data Management**:
  - Utilizes local storage for guest snapshots until the user logs in.
  - Merges guest data into the user's financial workspace upon login.

- **Notifications**:
  - Provides non-blocking notifications for actions like saving snapshots or encountering errors.

- **Subscription Management**:
  - Handles user tiers (free and premium) and associated features.
  - Fetches and applies subscription-related data from the backend.

- **Event Emission**:
  - Emits domain events for various actions, such as loading workspaces or saving snapshots.

This structure allows the Financial Mirror to provide a comprehensive financial management experience while ensuring data integrity and user engagement.
