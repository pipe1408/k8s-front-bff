const express = require('express');
const app = express();
const port = 3001;

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

// API endpoint to get the current time
app.get('/current-time', (req, res) => {
    const currentTime = getCurrentTime();
    res.json(currentTime);
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
