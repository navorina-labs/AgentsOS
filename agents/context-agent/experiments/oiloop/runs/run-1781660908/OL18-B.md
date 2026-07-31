# OL18 (B)

## Answer

Safari tab titles and URLs are fetched using the following process:

- The `SafariReader` executes JXA/AppleScript scripting commands.
- It queries the properties of Safari windows and tabs.
- The results are processed into an array of `SafariTab` summaries.
- This operation is bypassed if "Use Safari" is disabled in the settings.
