const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: `${__dirname}/env/.env` });

// Create express app
const app = express();

// Listen to port
const port = process.env.PORT || 5000;
app.listen(port, "localhost", () => {
  console.log(`Server is listening on port: ${port}`);
});
