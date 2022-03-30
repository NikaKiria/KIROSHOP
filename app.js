const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: `${__dirname}/env/.env` });
// Import Routes
const registerRouter = require("./routes/user/register/register.js");
const loginRoute = require("./routes/user/login/login.js");
const updateUserRoute = require("./routes/user/update-user/updateUser.js");
const deleteUserRoute = require("./routes/user/delete-user/deleteUser.js");
const createProductRoute = require("./routes/products/create-product/createProduct.js");
const getProductsRoute = require("./routes/products/get-products/getProducts.js");
const editProductRoute = require("./routes/products/edit-product/editProduct.js");
const deleteProductRoute = require("./routes/products/delete-product/deleteProduct.js");
// Create express app
const app = express();
app.use(express.json());

// Routes
app.use("/api/v1", registerRouter);
app.use("/api/v1", loginRoute);
app.use("/api/v1", updateUserRoute);
app.use("/api/v1", deleteUserRoute);
app.use("/api/v1", createProductRoute);
app.use("/api/v1", getProductsRoute);
app.use("/api/v1", editProductRoute);
app.use("/api/v1", deleteProductRoute);
// Listen to port
const port = process.env.PORT || 5000;
app.listen(port, "localhost", () => {
  console.log(`Server is listening on port: ${port}`);
});
