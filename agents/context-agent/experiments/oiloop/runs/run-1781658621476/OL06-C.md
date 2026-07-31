# OL06 (C)

## Answer

When a user requests "organize downloads," the following occurs:

- The **FileOrganizer** scans the Downloads folder for loose files.
- It evaluates user-defined rules (e.g., "don't touch invoices") using the **UserRuleParser**.
- A proposed plan for file movements is created by the **FileOrganizeService**.
- The user is presented with a **FilePreviewSheet** showing pending moves, including:
  - Source paths of files to be moved.
  - Target category folders.
  - Any skipped items due to user rules.
- The user must confirm the proposed moves by clicking the "Apply moves" button in the **FilePreviewSheet**.
- If confirmed, the files are moved according to the proposed plan.
