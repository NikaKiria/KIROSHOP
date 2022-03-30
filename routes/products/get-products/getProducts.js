const express = require("express");
const connectionPool = require("../../../database/dbconnect");
const auth = require("../../middlewares/auth.js");
const router = express.Router();

// Function that fetches products from db
const getProducts = async () => {
  const productsObjects = await connectionPool.query(
    `SELECT * FROM products
        LIMIT 200`
  );
  return productsObjects;
};

router.get("/products", auth, async (req, res) => {
  try {
    const fetchedProducts = await getProducts();
    if (fetchedProducts) {
      return res.status(200).json(fetchedProducts[0]);
    } else {
      return res.status(400).json("Bad Request!");
    }
  } catch (err) {
    return res.status(500).json("Something Went Wrong!");
  }
});

module.exports = router;
