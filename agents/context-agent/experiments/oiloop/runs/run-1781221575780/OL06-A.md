# OL06 (A)

## Answer

When a user requests "organize downloads," the following occurs:

- The `userWantsOrganize` method in the `FileOrganizeService` checks if the request contains keywords related to organizing files.
- If the request is recognized, the `handleOrganizeIntent` method is invoked.
- The method prepares a plan to move files into category folders (e.g., Images, Documents) using the `FileOrganizer.proposeOrganization` method.
- If there are no files to move, the assistant responds that everything is already organized.
- If there are files to move, the assistant informs the user that a plan has been prepared and prompts them to open the preview sheet to review the proposed moves.
- The user must confirm the action in the preview sheet for the organization to take place.
