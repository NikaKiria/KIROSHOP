const express = require("express");
const joi = require("joi");
const escape = require("escape-html");
const connectionPool = require("../../../database/dbconnect.js");
const auth = require("../../middlewares/auth.js");
const router = express.Router();

// Schema to validate provided object
const providedOrderObjectSchema = joi.object().keys({
  address: joi.string().required(),
  card_number: joi.string().required(),
  card_validity_period: joi.string().required(),
  cvc_cvv: joi.string().min(3).max(3).required(),
  products: joi.required(),
});

// Escape html tags in provided object's properties
const escapeHTML = (rawProvidedObject) => {
  i = 0;
  Object.values(rawProvidedObject).map((property) => {
    property = escape(property);
    let keyForValue = Object.keys(rawProvidedObject)[i];
    rawProvidedObject[keyForValue] = property;
    i++;
  });
  return rawProvidedObject;
};

// Fetch products from db with their product_id
const fetchProducts = async (productsIDs) => {
  const fetchedObjects = await connectionPool.query(
    `SELECT * FROM products
    WHERE product_id in(${productsIDs});
    `
  );
  return fetchedObjects[0];
};

// Evaluate total price of items in order ( sum of special_prices )
const evaluateTotal = (fetchedProducts) => {
  let i = 0;
  fetchedProducts.forEach((item) => {
    i = i + Number(item.special_price);
  });
  return i;
};

// Create order object
const createOrderObject = (userEmail, itemsTotalPrice, providedObject) => {
  const orderObject = {
    buyer_email: userEmail,
    address: providedObject.address,
    total_price: itemsTotalPrice,
    delivery_price: 0,
    total_to_pay: itemsTotalPrice,
  };
  return orderObject;
};

// Function that adds record to db
const createOrder = async (connectionPool, orderObject) => {
  const creationResult = await connectionPool.query(
    `INSERT INTO orders (
        buyer_email,
        address,
        total_price,
        total_to_pay
      ) 
      VALUES (
          '${orderObject.buyer_email}',
          '${orderObject.address}',
          '${orderObject.total_price}',
          '${orderObject.total_to_pay}'
      );
    `
  );
  const orderID = await connectionPool.query("SELECT LAST_INSERT_ID()");
  const orderCreationResult = {
    creationResult: creationResult[0],
    orderID: orderID[0][0]["LAST_INSERT_ID()"],
  };
  return orderCreationResult;
};

// Create order items (single products in order) in DB
const createOrderItems = async (connectionPool, orderID, fetchedProducts) => {
  let orderItemsToBeCreated = [];
  let lastIndex = fetchedProducts.length - 1;
  // Push products to orderItemsToBeCreated array
  await fetchedProducts.forEach((product, index) => {
    if (index < lastIndex) {
      orderItemsToBeCreated.push(
        `(
        ${orderID},
        ${product.product_id},
        ${product.price},
        ${product.special_price},
        '${product.category}',
        '${product.image}'
        ) `
      );
    } else {
      orderItemsToBeCreated.push(
        `(
        ${orderID},
        ${product.product_id},
        ${product.price},
        ${product.special_price},
        '${product.category}',
        '${product.image}'
        ); `
      );
    }
  });
  // Create order items records in db
  const orderItemCreationResult = await connectionPool.query(
    `INSERT INTO order_items (
        order_id,
        item_id,
        item_price,
        item_special_price,
        item_category,
        image
      ) 
      VALUES 
        ${orderItemsToBeCreated.map((item) => item)}
    `
  );
  return orderItemCreationResult;
};

router.post("/create-order", auth, async (req, res) => {
  try {
    const rawProvidedObject = req.body;
    const userEmail = req.user;
    // Escape html tags in provided object
    const providedObject = escapeHTML(rawProvidedObject);
    // Validate provided object
    const validationResult = providedOrderObjectSchema.validate(providedObject);
    if (validationResult.error) {
      return res.status(400).json(validationResult.error.details[0].message);
    }
    // Fetch products from db
    const productsIDs = JSON.parse(providedObject.products);
    const fetchedProducts = await fetchProducts(productsIDs);
    // Check if all products are present in fetchedproducts
    if (productsIDs.length != fetchedProducts.length) {
      return res.status(400).json("Some Products Are Not Available!");
    }
    // Evaluate total price of items in order
    const itemsTotalPrice = evaluateTotal(fetchedProducts);
    // Create order object
    const orderObject = createOrderObject(
      userEmail,
      itemsTotalPrice,
      providedObject
    );
    // Create order in db
    const createdOrder = await createOrder(connectionPool, orderObject);
    if (createdOrder.creationResult.affectedRows == 0) {
      return res.status(500).json("Cant Make Order!");
    }
    // Create Order items in db
    const createdOrderItems = await createOrderItems(
      connectionPool,
      createdOrder.orderID,
      fetchedProducts
    );
    if (createdOrderItems[0].affectedRows == 0) {
      return res.status(500).json("Cant Make Order!");
    } else {
      return res.status(201).json("Order Successfully Created!");
    }
  } catch (err) {
    return res.status(500).json(err.message);
  }
});

module.exports = router;
