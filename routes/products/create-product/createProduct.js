const express = require("express");
const joi = require("joi");
const escape = require("escape-html");
const connectionPool = require("../../../database/dbconnect.js");
const auth = require("../../middlewares/auth.js");
const router = express.Router();

// Schema to validate new user info
const newProductSchema = joi.object().keys({
  category: joi.string().min(2).max(30).required(),
  brand: joi.string().min(3).max(30).required(),
  price: joi.number().required(),
  special_price: joi.number().required(),
  stock: joi.number().required(),
  name_geo: joi.string().min(2).max(50).required(),
  description_geo: joi.string().max(300),
  name_en: joi.string().min(2).max(50),
  description_en: joi.string().max(300),
  image: joi.string().required(),
});

// Escape html tags in provided object's properties
const escapeHTML = (productInfo) => {
  i = 0;
  Object.values(productInfo).map((property) => {
    property = escape(property);
    let keyForValue = Object.keys(productInfo)[i];
    productInfo[keyForValue] = property;
    i++;
  });
  return productInfo;
};

// Function that adds record to db
const createRecord = async (connectionPool, productInfo) => {
  const creationResult = await connectionPool.query(
    `INSERT INTO products (
        category,
        brand,
        price,
        special_price,
        stock,
        name_geo,
        description_geo,
        name_en,
        description_en,
        image
      ) 
      VALUES (
          '${productInfo.category}',
          '${productInfo.brand}',
          ${productInfo.price},
          ${productInfo.special_price},
          ${productInfo.stock},
          '${productInfo.name_geo}',
          '${productInfo.description_geo || ""}',
          '${productInfo.name_en || ""}',
          '${productInfo.description_en || ""}',
          '${productInfo.image}'
      )`
  );
  return creationResult;
};

router.post("/create-product", auth, async (req, res) => {
  try {
    const rawProductInfo = await req.body;
    // Escape html tags in provided info
    const productInfo = await escapeHTML(rawProductInfo);
    // Validate raw product info
    const validationResult = newProductSchema.validate(productInfo);
    if (validationResult.error) {
      return res.status(400).json(validationResult.error.details[0].message);
    }
    // Create new product in database
    const createdRecord = await createRecord(connectionPool, productInfo);
    if (createdRecord) {
      return res.status(200).json("Product Created!");
    } else {
      return res.status(500).json("Something Went Wrong!");
    }
  } catch (err) {
    return res.status(500).json(err.message);
  }
});

module.exports = router;
