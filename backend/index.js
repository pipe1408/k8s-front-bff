const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3001;

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// In-memory guestbook storage
const guestbook = [];

// Function to get the current time components
function getCurrentTime() {
    const now = new Date();

    return {
        year: now.getFullYear(),
        month: now.getMonth() + 1, // Months are zero-based, so add 1
        day: now.getDate(),
        hour: now.getHours(),
        minute: now.getMinutes(),
        second: now.getSeconds(),
        millisecond: now.getMilliseconds()
    };
}

// Endpoint to get the current time
app.get('/current-time', (req, res) => {
    const currentTime = getCurrentTime();
    res.json(currentTime);
});

// Endpoint to add a message to the guestbook
app.post('/guestbook', (req, res) => {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Message is required and must be a string.' });
    }

    const timestamp = getCurrentTime();
    guestbook.push({ message, timestamp });

    res.status(201).json({ success: true, message: 'Message added to guestbook.' });
});

// Endpoint to retrieve all messages from the guestbook
app.get('/guestbook', (req, res) => {
    res.json(guestbook);
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});