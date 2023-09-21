import cv2
import pyautogui

# Initialize the webcam
cap = cv2.VideoCapture(0)

# Load the face detection model
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

# Initialize variables
prev_nose_y = 0  # Initialize the previous nose position
sensitivity = 2  # Adjust sensitivity as needed
drag_threshold = 20  # Threshold for drag detection

dragging = False  # Flag to indicate dragging state
drag_start_pos = None  # Start position for dragging

while True:
    # Capture a frame from the webcam
    ret, frame = cap.read()

    # Convert the frame to grayscale for face detection
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    # Detect faces in the frame
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.3, minNeighbors=5)

    for (x, y, w, h) in faces:
        # Draw a rectangle around the detected face
        cv2.rectangle(frame, (x, y), (x + w, y + h), (255, 0, 0), 2)

        # Calculate the approximate position of the nose (assuming it's at the center of the face)
        nose_x = x + w // 2
        nose_y = y + h // 2

        # Calculate the vertical movement of the nose
        nose_movement = nose_y - prev_nose_y

        # Map nose movement to mouse movement
        pyautogui.move(0, nose_movement * sensitivity)

        # Check for drag conditions
        if abs(nose_movement) > drag_threshold:
            if not dragging:
                dragging = True
                drag_start_pos = pyautogui.position()
                pyautogui.mouseDown()  # Simulate left mouse button down
            else:
                # If already dragging, continue to move the mouse upward by dragging
                pyautogui.dragRel(0, -nose_movement * sensitivity)

        # Update the previous nose position
        prev_nose_y = nose_y

    # Check if dragging has ended
    if dragging and abs(nose_movement) <= drag_threshold:
        dragging = False
        pyautogui.mouseUp()  # Simulate left mouse button up

    # Display the frame with face detection and nose tracking
    cv2.imshow('Push-pong', frame)

    # Exit the loop when 'q' key is pressed
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release the webcam and close all OpenCV windows
cap.release()
cv2.destroyAllWindows()
