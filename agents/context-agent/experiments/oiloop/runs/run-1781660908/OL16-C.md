# OL16 (C)

## Answer

The hand gesture camera stream recognizes confirm or cancel commands through the following process:

- **Gesture Detection**: The `GestureEngine` captures local camera frames using `AVCaptureSession` and analyzes hand poses with `VNDetectHumanHandPoseRequest`.
- **Gesture Classification**: The `HandGestureClassifier` classifies the detected hand poses into specific actions:
  - **Fist to Open**: Recognized as a confirm action.
  - **Closed Fist**: Recognized as a cancel action.
- **Event Routing**: The `InputFusion` class routes the recognized gestures to trigger corresponding UI actions:
  - If the gesture is a confirm action, it posts a notification to confirm the preview.
  - If the gesture is a cancel action, it posts a notification to cancel the preview.

This process ensures that gestures are processed locally, with no video streaming or cloud storage involved.
