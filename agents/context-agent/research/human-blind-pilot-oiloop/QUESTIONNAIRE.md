# Human Blind Pilot — Oiloop (10 questions)

**Instructions:** For each question, read both answers. Pick which is more useful for making a decision about Oiloop. Do not guess which system produced which answer.

**Choices per question:** Answer 1 preferred · Answer 2 preferred · Equal · Neither useful

Record choices in `research/human-blind-pilot-oiloop.csv` (column `display_id`, not OL id).

---

## Q01

**Question:** Where is the Oiloop assistant's system prompt compiled and built?

### Answer 1

The Oiloop assistant's system prompt is compiled and built in the `SystemPromptBuilder` class, specifically through the `build` function.

### Answer 2

The Oiloop assistant's system prompt is compiled and built in the `AgentCriticService` class, specifically in the `reviewPlanOrCode` method. This method constructs a system prompt that instructs the assistant to review proposed code modifications, actions, or terminal commands.

---

## Q02

**Question:** How does EventKit Reminders authorization avoid freezing Oiloop in background mode?

### Answer 1

The provided context does not contain information about how EventKit Reminders authorization is handled in the Oiloop project or how it avoids freezing the application in background mode. Additional details regarding the implementation of EventKit Reminders and its interaction with the Oiloop app's background processes are needed to answer this question.

### Answer 2

EventKit Reminders authorization avoids freezing Oiloop in background mode by implementing the following:

- **Headless Mode Check**: The `RemindersReader` checks for the `--headless` command line argument.
- **Immediate Return**: If the authorization status is `notDetermined` and the application is running in headless mode, it returns `false` (or empty) immediately.
- **No Prompting**: This approach prevents prompting the user for permissions, which could block the application and cause freezes when running as a background agent.

---

## Q03

**Question:** How does Oiloop store user preferences and chat history?

### Answer 1

Oiloop stores user preferences and chat history using the following methods:

- **User Preferences:**
  - Stored in a SQLite database via the `MemoryStore` class.
  - Preferences are loaded and saved using the `DatabaseSettings` struct, which handles encoding and decoding of settings to and from JSON.
  - Specific settings like `PresenceSettings`, `LocalLLMSettings`, and others are managed through dedicated structs that define their properties and provide methods for loading and saving.

- **Chat History:**
  - Chat messages are stored in the SQLite database within the `messages` table.
  - Each message is associated with a session and includes details such as the message role (user, assistant, system), content, and timestamp.
  - The `ChatOrchestrator` class manages the retrieval and storage of chat messages, ensuring they are appended to the history as conversations progress.

Overall, Oiloop utilizes a combination of SQLite for persistent storage and structured data models to manage user preferences and chat history effectively.

### Answer 2

Oiloop stores user preferences and chat history using the following mechanisms:

- **User Preferences**:
  - Managed by the `PersonaSettings` entity, which includes fields for:
    - Assistant display name
    - User preferred name
    - Tone preset
    - Other configuration settings related to user preferences.

- **Chat History**:
  - Stored in a local SQLite database managed by the `MemoryStore` entity.
  - Chat sessions, messages, facts, and memory episodes are organized in tables within this database.
  - Memory episodes are compressed automatically to save context tokens when they reach a threshold of 28 messages, with a recent message window of 24.

This ensures that all user data remains local and private, adhering to the project's privacy invariants.

---

## Q04

**Question:** What SwiftUI view displays the preview of files to be moved?

### Answer 1

The SwiftUI view that displays the preview of files to be moved is `FilePreviewSheet`.

### Answer 2

The SwiftUI view that displays the preview of files to be moved is the **`FilePreviewSheet`**.

---

## Q05

**Question:** How does Oiloop handle sandboxed folder access on macOS?

### Answer 1

The provided context does not contain specific information about how Oiloop handles sandboxed folder access on macOS. Details regarding the implementation or management of sandboxed folder access are missing.

### Answer 2

Oiloop handles sandboxed folder access on macOS through the following steps:

1. **User Selection**: The user picks a folder using `NSOpenPanel`.
2. **Bookmark Saving**: The selected folder's bookmark data is saved via the `DatabaseSettings` key `workspace_folder_bookmark`, and the display path is shown in `workspace_folder_path_display`.
3. **Bookmark Resolution**: The `WorkspaceAccess.withWorkspace` method resolves the bookmark and refreshes it if stale.
4. **Accessing Resource**: The method `URL.startAccessingSecurityScopedResource()` is called to gain access to the folder.
   - If access fails, it returns `FileToolError.accessDenied`.
5. **File Operations**: File operations are executed within the `body` of the access block, and `stopAccessingSecurityScopedResource` is called in a `defer` statement to ensure proper cleanup.
6. **Error Handling**: If the bookmark is missing, it returns `FileToolError.workspaceNotConfigured`. Additionally, any attempts to write outside allowed paths result in `WorkspaceFileToolError.accessDenied(String)`.

This process ensures compliance with macOS sandboxing requirements for file operations.

---

## Q06

**Question:** How does the hand gesture camera stream recognize confirm or cancel commands?

### Answer 1

The hand gesture camera stream recognizes confirm or cancel commands through specific gestures:

- **Open Palm Gesture**: 
  - Holding an open palm for a duration (e.g., 1 second) is used to stop or pause assistant speech.

- **Fist Gesture**: 
  - A fist gesture followed by an open hand gesture is used to confirm an action.

- **Both Hands Down Gesture**: 
  - This gesture is used to cancel a preview or action.

- **Phone at Ear Gesture**: 
  - This gesture activates push-to-talk functionality.

These gestures are processed by the gesture engine, which interprets them and triggers the corresponding commands in the application.

### Answer 2

The hand gesture camera stream recognizes confirm or cancel commands through the following process:

- **Gesture Detection**: The `GestureEngine` captures local camera frames using `AVCaptureSession`.
- **Pose Analysis**: It analyzes hand poses using `VNDetectHumanHandPoseRequest`.
- **Gesture Mapping**:
  - An open palm gesture is mapped to a "pause" command.
  - A fist-to-open gesture is mapped to a "confirm" command.
- **Event Routing**: The `InputFusion` component routes the detected gesture events to activate SwiftUI sheets for confirmation or cancellation actions.

---

## Q07

**Question:** How does Oiloop read inbox headers from Apple Mail?

### Answer 1

The context provided does not contain specific information about how Oiloop reads inbox headers from Apple Mail. Details regarding the implementation or methods used for accessing Apple Mail inbox headers are missing.

### Answer 2

Oiloop reads inbox headers from Apple Mail using the following process:

- **MailService**: Coordinates the automation.
- **MailReader**: Executes JXA/AppleScript scripting to read recent inbox headers.
- **System Settings Automation Permission**: Requires permission for Mail to function.
- **Toggle Option**: The feature is bypassed if "Use Apple Mail" is toggled off in Settings.

---

## Q08

**Question:** Why can Oiloop not directly send Apple Messages via an API?

### Answer 1

Oiloop cannot directly send Apple Messages via an API because:

- Apple Messages does not provide a public API for sending messages programmatically.
- Oiloop respects user privacy and security, ensuring that no messages are sent automatically without user confirmation.
- The design of Oiloop requires user interaction for sending messages, which aligns with Apple's privacy policies.

### Answer 2

Oiloop cannot directly send Apple Messages via an API due to the following reason:

- **Lack of Public API**: There is no public API available for background silent sends of iMessages on macOS, which restricts automated sending without user interaction.

---

## Q09

**Question:** What settings controls exist for browser integration?

### Answer 1

The settings controls for browser integration in the Oiloop project include:

- **Toggles for Browser Usage**:
  - "Use Safari"
  - "Use Google Chrome"

These settings are managed through the `SettingsView` and are saved to settings storage in `MemoryStore`. If the toggles are disabled, the browser check is skipped in briefings.

### Answer 2

The settings controls for browser integration in the Oiloop project include:

- **Safari Integration:**
  - Toggle to enable or disable the use of Safari.
  
- **Chrome Integration:**
  - Toggle to enable or disable the use of Google Chrome.

- **Keyboard & Mouse Integration:**
  - Toggle to enable or disable the use of keyboard and mouse event simulation.

- **Shell Commands:**
  - Toggle to enable or disable the use of shell commands.

- **Screenshot Capture:**
  - Toggle to enable or disable the use of screenshots.

- **Mail Integration:**
  - Toggle to enable or disable the use of Apple Mail.

- **Messages Integration:**
  - Toggle to enable or disable the use of Apple Messages.

- **Notes Integration:**
  - Toggle to enable or disable the use of Apple Notes.

- **Reminders Integration:**
  - Toggle to enable or disable the use of Apple Reminders.

These settings allow users to control which browser and related services are integrated with the Oiloop application.

---

## Q10

**Question:** How are Safari tab titles and URLs fetched?

### Answer 1

The Safari tab titles and URLs are fetched as part of the `SafariPlan` structure, which is used in the `SafariTabPreviewSheet`. The specific implementation details for fetching the tabs are not provided in the context, but it typically involves accessing the Safari application or its API to retrieve the currently open tabs, including their titles and URLs. 

If you need more specific implementation details or code snippets related to fetching Safari tabs, that information is missing from the provided context.

### Answer 2

Safari tab titles and URLs are fetched using the following process:

- The `SafariReader` executes JXA/AppleScript scripting commands.
- It queries the properties of Safari windows and tabs.
- The results are processed into an array of `SafariTab` summaries.
- This operation is bypassed if "Use Safari" is disabled in the settings.

---

