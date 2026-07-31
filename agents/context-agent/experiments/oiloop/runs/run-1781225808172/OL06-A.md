# OL06 (A)

## Answer

When a user requests "organize downloads," the following occurs:

- The `userWantsOrganize` method in the `FileOrganizeService` checks if the request contains keywords related to organizing files.
- If the request is recognized, the `handleOrganizeIntent` method is invoked.
- This method prepares a plan to organize files in the user's workspace folder by calling `preparePlan` on the `FileOrganizeService`.
- The plan details the files that will be moved into category folders (e.g., Images, Documents).
- The user is informed about the plan, and they are prompted to review it in a preview sheet.
- The actual file organization will not occur until the user confirms the action in the preview sheet.
