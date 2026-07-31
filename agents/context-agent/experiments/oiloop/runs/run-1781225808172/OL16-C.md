# OL16 (C)

## Answer

The hand gesture camera stream recognizes confirm or cancel commands through the following process:

- **Gesture Classification**: The `GestureEngine` and `CompanionHandGestureEngine` classes utilize a `HandGestureClassifier` to classify hand landmarks detected from the camera stream.
- **Gesture Actions**: Specific gestures are mapped to actions:
  - **Fist → Open**: This gesture confirms a file organize preview (same as "Apply moves").
  - **Closed Fist**: This gesture cancels a pending organize.
- **On-device Processing**: The camera video frames are analyzed locally using Apple Vision, ensuring that no video data is sent to the cloud.
- **Debounce Mechanism**: A debounce time interval (0.85 seconds) is implemented to prevent multiple triggers from the same gesture within a short time frame.

This setup allows the system to accurately interpret hand gestures as commands for confirmation or cancellation.
