# OL16 (B)

## Answer

The hand gesture camera stream recognizes confirm or cancel commands through the following process:

- **Gesture Detection**: The `GestureEngine` captures local camera frames using `AVCaptureSession`.
- **Pose Analysis**: It analyzes hand poses via `VNDetectHumanHandPoseRequest`.
- **Gesture Mapping**:
  - An open palm gesture is mapped to a "pause" command.
  - A fist-to-open gesture is mapped to a "confirm" command.
- **Event Routing**: The `InputFusion` class routes the detected gesture events to activate SwiftUI sheets for confirmation or cancellation actions.
