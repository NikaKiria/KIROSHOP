const express = require("express");
const connectionPool = require("../../../database/dbconnect.js");
const bcrypt = require("bcrypt");
const escape = require("escape-html");
const joi = require("joi");
const auth = require("../../middlewares/auth.js");
const router = express.Router();

// Delete product from db
const deleteProduct = async (productID) => {
  const deletedProduct = await connectionPool.query(
    `DELETE FROM products
        WHERE product_id = '${productID}'`
  );
  return deletedProduct;
};

router.delete("/delete-product/:id", auth, async (req, res) => {
  try {
    const productID = req.params.id;
    // Delete User
    const deletedProductSuccess = await deleteProduct(productID);
    if (deletedProductSuccess[0].affectedRows == 0) {
      return res.status(500).json("Something Went Wrong");
    } else {
      return res.status(202).json("User Successfully Deleted!");
    }
  } catch (err) {
    return res.status(500).json(err.message);
  }
});

module.exports = router;
