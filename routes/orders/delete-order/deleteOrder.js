const express = require("express");
const connectionPool = require("../../../database/dbconnect.js");
const bcrypt = require("bcrypt");
const escape = require("escape-html");
const joi = require("joi");
const auth = require("../../middlewares/auth.js");
const router = express.Router();

// Fetch order author from db
const fetchAuthorFromDB = async (userEmail, orderID) => {
  const fetchOrderAuthor = await connectionPool.query(
    `SELECT buyer_email
    FROM orders
    WHERE order_id = '${orderID}'`
  );
  const fetchedOrderAuthor = fetchOrderAuthor[0][0].buyer_email;
  console.log(fetchedOrderAuthor);
  return fetchedOrderAuthor;
};

// Delete product from db
const deleteOrder = async (orderID) => {
  const deletedOrder = await connectionPool.query(
    `DELETE FROM orders
    WHERE order_id = '${orderID}'`
  );
  return deletedOrder;
};

router.delete("/delete-order/:id", auth, async (req, res) => {
  try {
    const orderID = req.params.id;
    const userEmail = req.user;
    // Check if user is author
    const orderAuthor = await fetchAuthorFromDB(req.user, orderID);
    if (orderAuthor !== userEmail) {
      return res.status(400).json("Bad Request!");
    }
    // Delete Order
    const deletedOrderSuccess = await deleteOrder(orderID);
    if (deletedOrderSuccess[0].affectedRows == 0) {
      return res.status(500).json("Something Went Wrong");
    } else {
      return res.status(202).json("Order Successfully Deleted!");
    }
  } catch (err) {
    return res.status(500).json("Something Went Wrong!");
  }
});

module.exports = router;
