const express = require('express');

// Create express app
const app = express();

// Listen to port
app.listen(5000, 'localhost', () => {
    console.log(`Server is listening on port: ${5000}`);
});
