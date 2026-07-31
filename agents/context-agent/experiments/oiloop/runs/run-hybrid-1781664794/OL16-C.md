# OL16 (C)

## Answer

The hand gesture camera stream recognizes confirm or cancel commands through the following process:

- **Gesture Detection**: The `GestureEngine` captures camera frames using `AVCaptureSession` and analyzes hand poses with `VNDetectHumanHandPoseRequest`.
- **Hand Gesture Classification**: The `HandGestureClassifier` processes the detected hand poses to classify gestures:
  - **Open Palm**: If the hand is detected as an open palm for a specified duration, it triggers the "stopSpeaking" command.
  - **Fist Gesture**: If a closed fist is detected, it triggers the "cancel" command.
  - **Transition from Fist to Open Palm**: If a transition from a fist to an open palm is detected, it triggers the "confirm" command.
- **Gesture Handling**: The `InputFusion` class routes the recognized gestures to appropriate actions, such as confirming or canceling operations based on the detected gestures.

This process ensures that gestures are processed locally, with no video data being sent to the cloud.
