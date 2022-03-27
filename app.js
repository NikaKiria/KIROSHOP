const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: `${__dirname}/env/.env` });
// Import Routes
const registerRouter = require("./routes/user/register/register.js");
const loginRoute = require("./routes/user/login/login.js");
const updateUserRoute = require("./routes/user/update-user/updateUser.js");
const deleteUserRoute = require("./routes/user/delete-user/deleteUser.js");
// Create express app
const app = express();
app.use(express.json());

// Routes
app.use("/api/v1", registerRouter);
app.use("/api/v1", loginRoute);
app.use("/api/v1", updateUserRoute);
app.use("/api/v1", deleteUserRoute);
// Listen to port
const port = process.env.PORT || 5000;
app.listen(port, "localhost", () => {
  console.log(`Server is listening on port: ${port}`);
});
