const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: `${__dirname}/env/.env` });
// Import connector function (connects to mysql)
const connectionPool = require("./database/dbconnect.js");

// Create express app
const app = express();

// app.get("/", (req, res) => {
//   connectionPool.query("SELECT * FROM users", (err, result, fields) => {
//     err && console.log(err);
//     res.status(200).json(result);
//   });
// });

// Listen to port
const port = process.env.PORT || 5000;
app.listen(port, "localhost", () => {
  console.log(`Server is listening on port: ${port}`);
});
