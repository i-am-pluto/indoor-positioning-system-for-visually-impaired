document.addEventListener('DOMContentLoaded', function () {
    const video = document.getElementById('video');
    const destinationInput = document.getElementById('destination-input');
    const captureButton = document.getElementById('capture-button');
    const framesPerSecond = 5;

    let captureInterval;
    const capturedFrames = [];

    // Check if the browser supports the getUserMedia API
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // Request access to the camera
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function (stream) {
                video.srcObject = stream;
                video.play();
            })
            .catch(function (error) {
                console.error('Error accessing the camera: ', error);
            });
    } else {
        console.error('getUserMedia is not supported in this browser.');
    }

    function captureAndSendFrames() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        captureInterval = setInterval(async function () {
            // Set canvas dimensions to match the video
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            // Draw the current video frame onto the canvas
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Get the base64-encoded image data
            const imageData = canvas.toDataURL('image/jpeg');

            // Store the image data in the frames array


            capturedFrames.push(imageData);

            // Check if we have captured the desired number of frames
            if (capturedFrames.length === framesPerSecond) {
                console.log(capturedFrames);
                // Send the captured frames to the backend
                //await sendToBackend(capturedFrames);

                // Clear the frames array to start capturing a new set
                capturedFrames.length = 0;
            }

            // Clear the canvas after saving each frame
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }, 1000 / framesPerSecond);
    }

    function stopCapture() {
        clearInterval(captureInterval);
    }

    async function sendToBackend(frame) {
        // Replace the URL with your backend endpoint
        const backendURL = 'http://127.0.0.1:5000/getInstructions';

        // Make a POST request to the backend
        try {
            const response = await fetch(backendURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ frame }),
            });

            if (response.ok) {
                console.log('Frames sent successfully:', frame);
            } else {
                console.error('Failed to send frames:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Error sending frames:', error);
        }
    }

    // Event listener for the capture button
    captureButton.addEventListener('click', function () {
        if (destinationInput.value.trim() === '') {
            alert('Please enter a destination.');
            return;
        }

        // Stop the current capture interval if any
        stopCapture();

        // Start a new capture
        captureAndSendFrames();
    });
});