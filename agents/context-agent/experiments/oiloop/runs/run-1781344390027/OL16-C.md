# OL16 (C)

## Answer

The hand gesture camera stream recognizes confirm or cancel commands through the following process:

- **Gesture Classification**: The `GestureEngine` and `CompanionHandGestureEngine` classes utilize a `HandGestureClassifier` to classify hand landmarks detected from the camera stream.
- **Gesture Actions**: Specific gestures are mapped to actions:
  - **Fist → Open Palm**: This gesture is used to confirm actions.
  - **Closed Fist**: This gesture is used to cancel pending actions.
- **On-device Processing**: The camera stream is processed locally using Apple Vision, ensuring that no video data is uploaded or stored externally.
- **Debounce Mechanism**: A debounce time interval (0.85 seconds) is implemented to prevent multiple triggers from the same gesture within a short time frame.
- **Event Handling**: Recognized gestures trigger corresponding actions through the `onGesture` callback, which can then be handled by the application logic (e.g., confirming or canceling a file organization preview).
