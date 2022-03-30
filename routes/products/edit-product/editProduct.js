const express = require("express");
const connectionPool = require("../../../database/dbconnect");
const joi = require("joi");
const escape = require("escape-html");
const auth = require("../../middlewares/auth.js");
const router = express.Router();

// Schema to validate new user info
const ProductSchema = joi.object().keys({
  category: joi.string().min(2).max(30),
  brand: joi.string().min(3).max(30),
  price: joi.number(),
  special_price: joi.number(),
  stock: joi.number(),
  name_geo: joi.string().min(2).max(50),
  description_geo: joi.string().max(300),
  name_en: joi.string().min(2).max(50),
  description_en: joi.string().max(300),
  image: joi.string(),
});

// Escape html tags in provided object's properties
const escapeHTML = (rawProductUpdateInfo) => {
  i = 0;
  Object.values(rawProductUpdateInfo).map((property) => {
    property = escape(property);
    let keyForValue = Object.keys(rawProductUpdateInfo)[i];
    rawProductUpdateInfo[keyForValue] = property;
    i++;
  });
  return rawProductUpdateInfo;
};

// Function which updates product object
const updateProduct = async (connectionPool, productObject, productId) => {
  const updateObject = await connectionPool.query(
    `UPDATE products SET 
    ${Object.keys(productObject).map(
      (property) => `${property} = '${productObject[property]}' `
    )} 
    WHERE product_id = '${productId}'`
  );
  return updateObject[0];
};

router.put("/edit-product/:id", auth, async (req, res) => {
  try {
    const productId = req.params.id;
    const rawProductObject = await req.body;
    // Escape html tags in provided object
    const productObject = await escapeHTML(rawProductObject);
    // Validate user input
    const validationResult = ProductSchema.validate(productObject);
    if (validationResult.error) {
      return res.status(400).json(validationResult.error.details[0].message);
    }
    // Update user in db
    const updatedProduct = await updateProduct(
      connectionPool,
      productObject,
      productId
    );
    if (updatedProduct.affectedRows > 0) {
      return res.status(200).json("Product Updated!");
    } else {
      return res.status(400).json("Bad Request!");
    }
  } catch (err) {
    return res.status(500).json("Something Went Wrong!");
  }
});

module.exports = router;
