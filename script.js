// Festive Christmas Location Sharing App
// This script handles location sharing with explicit user consent

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const shareLocationBtn = document.getElementById('shareLocationBtn');
    const statusMessage = document.getElementById('statusMessage');
    const coordinatesDisplay = document.getElementById('coordinates');
    
    // API endpoint (mock endpoint - replace with your actual backend endpoint)
    // For testing, you can use a RequestBin or similar service
    const API_ENDPOINT = 'https://jsonplaceholder.typicode.com/posts'; // Mock endpoint
    
    // Christmas messages
    const christmasMessages = {
        success: [
            "Ho Ho Ho! Thank you for sharing your location! 🎅",
            "Christmas magic is on its way! Your surprise is being planned! 🎄",
            "Your location has been received! Get ready for a festive surprise! 🎁"
        ],
        error: [
            "That's okay! The Christmas spirit is in our hearts, not our locations! 🎄",
            "No worries! The magic of Christmas is everywhere! ✨",
            "That's perfectly fine! Wishing you a wonderful Christmas anyway! 🎅"
        ],
        fallback: "Even without your location, I wish you the merriest Christmas filled with joy and warmth! ❤️"
    };
    
    // Get a random message from an array
    function getRandomMessage(messageArray) {
        return messageArray[Math.floor(Math.random() * messageArray.length)];
    }
    
    // Update status message
    function updateStatus(message, type) {
        statusMessage.textContent = message;
        statusMessage.className = `status-message ${type}`;
        statusMessage.style.display = 'block';
    }
    
    // Show coordinates (for transparency)
    function showCoordinates(lat, lon) {
        coordinatesDisplay.innerHTML = `
            <strong>Coordinates shared:</strong><br>
            Latitude: ${lat.toFixed(6)}<br>
            Longitude: ${lon.toFixed(6)}<br>
            <small><em>This data was only sent because you explicitly consented</em></small>
        `;
        coordinatesDisplay.classList.add('show');
    }
    
    // Send coordinates to backend
    async function sendCoordinatesToBackend(latitude, longitude) {
        // Create data object to send
        const locationData = {
            latitude: latitude,
            longitude: longitude,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            purpose: "Christmas surprise delivery"
        };
        
        try {
            // Send data to backend endpoint
            // In a real implementation, you would use your actual backend endpoint
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(locationData)
            });
            
            if (response.ok) {
                console.log('Location data sent successfully:', locationData);
                return true;
            } else {
                console.error('Failed to send location data:', response.status);
                return false;
            }
        } catch (error) {
            console.error('Error sending location data:', error);
            return false;
        }
    }
    
    // Get user's location
    function getLocation() {
        // Check if Geolocation API is supported
        if (!navigator.geolocation) {
            updateStatus("Sorry, geolocation is not supported by your browser. But still, Merry Christmas! 🎄", "error");
            return;
        }
        
        // Show a waiting message
        updateStatus("Checking for location access... Please allow if prompted.", "info");
        
        // Request location with high accuracy
        navigator.geolocation.getCurrentPosition(
            // Success callback
            async function(position) {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                
                // Show the coordinates to the user (for transparency)
                showCoordinates(lat, lon);
                
                // Update status with success message
                updateStatus(getRandomMessage(christmasMessages.success), "success");
                
                // Send coordinates to backend
                const sendSuccess = await sendCoordinatesToBackend(lat, lon);
                
                if (sendSuccess) {
                    console.log("Coordinates sent to backend successfully");
                } else {
                    console.log("Coordinates could not be sent to backend, but were captured locally");
                }
                
                // Disable the button after successful sharing
                shareLocationBtn.disabled = true;
                shareLocationBtn.innerHTML = '<i class="fas fa-check-circle"></i> Location Shared! Thank you! 🎅';
                shareLocationBtn.style.background = 'linear-gradient(to bottom, #4CAF50, #2E7D32)';
            },
            // Error callback
            function(error) {
                let errorMessage;
                
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = "You chose not to share your location. " + getRandomMessage(christmasMessages.error);
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = "Location information is unavailable. " + christmasMessages.fallback;
                        break;
                    case error.TIMEOUT:
                        errorMessage = "The request to get your location timed out. " + christmasMessages.fallback;
                        break;
                    default:
                        errorMessage = "An unknown error occurred. " + christmasMessages.fallback;
                        break;
                }
                
                updateStatus(errorMessage, "error");
                
                // Change button text to reflect the denial
                shareLocationBtn.innerHTML = '<i class="fas fa-heart"></i> That\'s Okay - Merry Christmas Anyway! 🎄';
                shareLocationBtn.style.background = 'linear-gradient(to bottom, #757575, #424242)';
            },
            // Options
            {
                enableHighAccuracy: true,
                timeout: 10000, // 10 seconds
                maximumAge: 0 // Don't use cached position
            }
        );
    }
    
    // Event listener for the share location button
    shareLocationBtn.addEventListener('click', function() {
        // Clear any previous status messages
        statusMessage.style.display = 'none';
        coordinatesDisplay.classList.remove('show');
        
        // Get location when button is clicked
        getLocation();
    });
    
    // Add some festive effects
    function addFestiveEffects() {
        // Add a twinkling effect to the stars in the header
        const stars = document.querySelectorAll('.fa-star');
        stars.forEach((star, index) => {
            star.style.animation = `twinkle ${2 + index * 0.5}s infinite alternate`;
        });
        
        // Make the snowflakes in the header animate
        const snowflakes = document.querySelector('.snowflakes');
        let flakeCount = 12;
        snowflakes.innerHTML = '';
        
        for (let i = 0; i < flakeCount; i++) {
            const flake = document.createElement('span');
            flake.textContent = '❄';
            flake.style.animation = `twinkle ${1 + Math.random() * 2}s infinite alternate`;
            flake.style.animationDelay = `${Math.random() * 2}s`;
            flake.style.margin = '0 5px';
            snowflakes.appendChild(flake);
        }
    }
    
    // Initialize festive effects
    addFestiveEffects();
});