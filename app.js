const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: `${__dirname}/env/.env` });
// Import connector function (connects to mysql)
const connectToDB = require("./database/dbconnect.js");

// Create express app
const app = express();

// Connect to DB
const envVariables = process.env;
connectToDB(
  envVariables.HOST,
  envVariables.USER,
  envVariables.PASSWORD,
  envVariables.DATABASE
);

// Listen to port
const port = process.env.PORT || 5000;
app.listen(port, "localhost", () => {
  console.log(`Server is listening on port: ${port}`);
});
