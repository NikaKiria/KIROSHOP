require("dotenv").config({ path: `${__dirname}../../env/.env` });
const express = require("express");
const connectionPool = require("../../../database/dbconnect.js");
const bcrypt = require("bcrypt");
const escape = require("escape-html");
const joi = require("joi");
const jwt = require("jsonwebtoken");
const router = express.Router();

// Schema to validate user info
const userSchema = joi.object().keys({
  email: joi
    .string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "ge"] } }),
  password: joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
});

// Escape html tags in provided object's properties
const escapeHTML = (providedUserObject) => {
  i = 0;
  Object.values(providedUserObject).map((property) => {
    property = escape(property);
    let keyForValue = Object.keys(providedUserObject)[i];
    providedUserObject[keyForValue] = property;
    i++;
  });
  return providedUserObject;
};

// Fetch user from DB
const fetchUser = async (userEmail, connectionPool) => {
  const fetchResult = await connectionPool.query(
    `SELECT * FROM users WHERE email = '${userEmail}'`
  );
  return fetchResult[0][0];
};

// Function generates access token
const generateAccessToken = (email, secretToken) => {
  return jwt.sign({ email }, secretToken, { expiresIn: "1d" });
};

// Send user info and access token
const sendAccesstokenAndUserInfo = (fetchedUser, secretToken, res) => {
  const generatedAccessToken = generateAccessToken(
    fetchedUser.email,
    secretToken
  );
  if (!generateAccessToken) {
    return res.status(500).json("Token Generation Error!");
  }
  return res.status(200).json({
    generatedAccessToken,
    user: {
      id: fetchedUser.user_id,
      firstname: fetchedUser.firstname,
      lastname: fetchedUser.lastname,
      email: fetchedUser.email,
      id_number: fetchedUser.id_number,
      address: fetchedUser.user_address,
      card_number: fetchedUser.card_number,
      card_validity_period: fetchedUser.card_validity_period,
      cvc_cvv: fetchedUser.cvc_cvv,
    },
  });
};

router.post("/login", async (req, res) => {
  try {
    const providedUserObject = await req.body;
    // Escape html tags in provided user object
    const userObject = escapeHTML(providedUserObject);
    // Validate provided user object
    const validationResult = userSchema.validate(userObject);
    if (validationResult.error) {
      return res.status(400).json(validationResult.error.details[0].message);
    }
    // Check if user exists
    const fetchedUser = await fetchUser(userObject.email, connectionPool);
    if (!fetchedUser) {
      return res.status(401).json("Wrong Credentials!");
    }
    // Compare passwords
    const isCorrectPassword = await bcrypt.compare(
      userObject.password,
      fetchedUser.user_password
    );
    if (!isCorrectPassword) {
      return res.status(401).json("Wrong Password!");
    } else {
      sendAccesstokenAndUserInfo(
        fetchedUser,
        process.env.JWT_SECRET_TOKEN,
        res
      );
    }
  } catch (err) {
    return res.status(500).json(err.message);
  }
});

module.exports = router;
