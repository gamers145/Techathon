import cv2
import time

# Load the pre-trained Haar Cascade face detector
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

# Initialize the webcam
cap = cv2.VideoCapture(0)

# Initialize variables to store the initial position of the detected face and the points
initial_x, initial_y, initial_w, initial_h = 0, 0, 0, 0
points = 0

# Define a threshold for significant face movement
movement_threshold = 30  # Adjust this value as needed

# Initialize the timer variables
start_time = time.time()
interval = 1  # Increment points every second

while True:
    current_time = time.time()
    elapsed_time = current_time - start_time

    # If a second has passed, increment points
    if elapsed_time >= interval:
        points += 1
        start_time = current_time

    # Read a frame from the webcam
    ret, frame = cap.read()

    # Convert the frame to grayscale for face detection
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    # Detect faces in the frame
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.3, minNeighbors=5, minSize=(30, 30))

    # Check if a face is detected
    if len(faces) > 0:
        x, y, w, h = faces[0]  # Get the first detected face

        # Check if the face has moved significantly
        if (
            abs(x - initial_x) > movement_threshold
            or abs(y - initial_y) > movement_threshold
            or abs(w - initial_w) > movement_threshold
            or abs(h - initial_h) > movement_threshold
        ):
            points += 1  # Increase points when face is detected and moves significantly

        # Update the initial position of the detected face
        initial_x, initial_y, initial_w, initial_h = x, y, w, h

        # Draw a rectangle around the detected face
        cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)

    # Display the points
    cv2.putText(
        frame,
        f'Points: {points}',
        (10, 30),
        cv2.FONT_HERSHEY_SIMPLEX,
        1,
        (255, 0, 0),
        2,
        cv2.LINE_AA,
    )

    # Display the frame with the face detection
    cv2.imshow("Face Detection", frame)

    # Exit the loop when the 'q' key is pressed
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release the webcam and close all OpenCV windows
cap.release()
cv2.destroyAllWindows()
