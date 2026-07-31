# OL16 (C)

## Answer

The hand gesture camera stream recognizes confirm or cancel commands through the following process:

- **Gesture Classification**: The `GestureEngine` and `CompanionHandGestureEngine` classes utilize a `HandGestureClassifier` to classify hand landmarks detected from the camera stream.
- **Gesture Actions**: Specific gestures are mapped to actions:
  - **Open Palm (~1s)**: Stops assistant speech (confirm action).
  - **Fist → Open**: Confirms file organize preview.
  - **Closed Fist**: Cancels pending organize.
- **On-device Processing**: The camera video frames are processed locally using Apple Vision, ensuring that no video data is sent to the cloud.
- **Debounce Mechanism**: A debounce time interval (0.85 seconds) is implemented to prevent multiple triggers from the same gesture.
- **Event Handling**: Recognized gestures trigger corresponding actions through the `onGesture` callback, which can be handled by the application logic to confirm or cancel operations.
