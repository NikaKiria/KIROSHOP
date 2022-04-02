const express = require("express");
const connectionPool = require("../../../database/dbconnect");
const auth = require("../../middlewares/auth.js");
const router = express.Router();

// Function that fetches products from db
const getOrders = async (userEmail) => {
  const orderItemsQueryResult = await connectionPool.query(
    `SELECT * 
    FROM orders
    RIGHT JOIN order_items 
    ON orders.order_id = order_items.order_id
    WHERE buyer_email = '${userEmail}'`
  );
  return orderItemsQueryResult[0];
};

router.get("/orders", auth, async (req, res) => {
  try {
    const fetchedOrders = await getOrders(req.user);
    console.log(fetchedOrders);
    if (fetchedOrders) {
      return res.status(200).json(fetchedOrders);
    } else {
      return res.status(400).json("Bad Request!");
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json("Something Went Wrong!");
  }
});

module.exports = router;
