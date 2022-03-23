const express = require("express");
const bcrypt = require("bcrypt");
const joi = require("joi");
const escape = require("escape-html");
const connectionPool = require("../../../database/dbconnect.js");
const router = express.Router();

// Schema to validate new user info
const newUserSchema = joi.object().keys({
  firstname: joi.string().alphanum().min(3).max(30).required(),
  lastname: joi.string().alphanum().min(3).max(30).required(),
  email: joi
    .string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "ge"] } })
    .required(),
  user_password: joi
    .string()
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .required(),
  repeat_password: joi.ref("password"),
  id_number: joi.number().integer().required(),
  user_address: joi.string().required(),
  card_number: joi.string(),
  card_validity_period: joi.string(),
  cvc_cvv: joi.string(),
});

// Escape html tags in provided object's properties
const escapeHTML = (rawUserInfo) => {
  i = 0;
  Object.values(rawUserInfo).map((property) => {
    property = escape(property);
    let keyForValue = Object.keys(rawUserInfo)[i];
    rawUserInfo[keyForValue] = property;
    i++;
  });
  console.log(rawUserInfo);
  return rawUserInfo;
};

// Hash password
const hashPassword = async (escapedUserInfo) => {
  const salt = await bcrypt.genSalt(10);
  escapedUserInfo.user_password = await bcrypt.hash(
    escapedUserInfo.user_password,
    salt
  );
};

router.post("/register", async (req, res) => {
  try {
    const rawUserInfo = await req.body;
    // Escape html tags in provided info
    const escapedUserInfo = await escapeHTML(rawUserInfo);
    console.log(escapedUserInfo);
    // Validate raw user info
    const validationResult = newUserSchema.validate(escapedUserInfo);
    if (validationResult.error) {
      return res.status(400).json(validationResult.error);
    }
    // Hash password
    await hashPassword(escapedUserInfo);
    // Create new user in database
    connectionPool.query(
      `INSERT INTO users (
          firstname,
          lastname,
          email,
          user_password,
          id_number,
          user_address,
          card_number,
          card_validity_period,
          cvc_cvv
        ) 
        VALUES (
            '${escapedUserInfo.firstname}',
            '${escapedUserInfo.lastname}',
            '${escapedUserInfo.email}',
            '${escapedUserInfo.user_password}',
            ${escapedUserInfo.id_number},
            '${escapedUserInfo.user_address}',
            '${escapedUserInfo.card_number || null}',
            '${escapedUserInfo.card_validity_period || null}',
            '${escapedUserInfo.cvc_cvv || null}'
        )`,
      (err) => {
        if (err) {
          return res.status(404).json("Bad Request!");
        } else {
          return res.status(201).json("User Created!");
        }
      }
    );
  } catch (err) {
    return res.status(500).json("Server Error!");
  }
});

module.exports = router;
