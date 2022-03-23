const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: `${__dirname}/env/.env` });
// Import Routes
const registerRouter = require("./routes/user/register/register.js");

// Create express app
const app = express();
app.use(express.json());

// Routes
app.use("/api/v1", registerRouter);

// Listen to port
const port = process.env.PORT || 5000;
app.listen(port, "localhost", () => {
  console.log(`Server is listening on port: ${port}`);
});
