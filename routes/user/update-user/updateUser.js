const express = require("express");
const bcrypt = require("bcrypt");
const connectionPool = require("../../../database/dbconnect");
const joi = require("joi");
const escape = require("escape-html");
const auth = require("../../middlewares/auth.js");
const router = express.Router();

// Schema to validate new user info
const UserObjectSchema = joi.object().keys({
  firstname: joi.string().alphanum().min(3).max(30),
  lastname: joi.string().alphanum().min(3).max(30),
  email: joi
    .string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "ge"] } }),
  user_password: joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  repeat_password: joi.ref("password"),
  id_number: joi.number().integer().min(10000000000).max(99999999999),
  user_address: joi.string(),
  card_number: joi.string(),
  card_validity_period: joi.string(),
  cvc_cvv: joi.string().min(3).max(3),
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
  return rawUserInfo;
};

// Function which updates user object
const updateUser = async (connectionPool, newUserObject, req) => {
  const updateObject = await connectionPool.query(
    `UPDATE users SET 
    ${Object.keys(newUserObject).map(
      (property) => `${property} = '${newUserObject[property]}' `
    )} 
    WHERE email = '${req.user}'`
  );
  return updateObject[0];
};

router.put("/updateUser", auth, async (req, res) => {
  try {
    const providedUserObject = await req.body;
    // Escape html tags in provided object
    const newUserObject = await escapeHTML(providedUserObject);
    // Validate user input
    const validationResult = UserObjectSchema.validate(newUserObject);
    if (validationResult.error) {
      return res.status(400).json(validationResult.error.details[0].message);
    }
    // Hash password if user requires change
    if (newUserObject.user_password) {
      const salt = await bcrypt.genSalt(10);
      newUserObject.user_password = await bcrypt.hash(
        newUserObject.user_password,
        salt
      );
    }
    // Update user in db
    const updatedUser = await updateUser(connectionPool, newUserObject, req);
    if (updatedUser) {
      return res.status(200).json("User Updated!");
    } else {
      return res.status(400).json("Bad Request!");
    }
  } catch (err) {
    return res.status(500).json(err.message);
  }
});

module.exports = router;
