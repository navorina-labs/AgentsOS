# OL16 (D)

## Answer

The hand gesture camera stream recognizes confirm or cancel commands through the following process:

- **Gesture Detection**: The `GestureEngine` captures local camera frames using `AVCaptureSession`.
- **Pose Analysis**: It analyzes hand poses via `VNDetectHumanHandPoseRequest`.
- **Mapping Gestures**:
  - An open palm gesture is mapped to a "pause" action.
  - A fist-to-open gesture is mapped to a "confirm" action.
- **Event Routing**: The `InputFusion` component routes these gesture events to activate SwiftUI sheets for confirmation (like confirming or cancelling open previews).
