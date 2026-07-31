# NV12 (B)

## Answer

The guest workspace merge works as follows:

- It is part of the onboarding process, specifically during the signup phase.
- The merge occurs when a guest user signs up, transitioning their guest workspace into a user workspace.
- The relevant test for this functionality is located in `Navorina/scripts/nucleus-guest-workspace-merge.test.mjs` and is also covered in the end-to-end test `e2e/nucleus-guest-workspace-merge.spec.ts`. 

For more details, the specific implementation can be found in the file `Navorina/src/utils/nucleus-onboarding-wizard.ts`.
