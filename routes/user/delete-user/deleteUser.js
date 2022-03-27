const express = require("express");
const connectionPool = require("../../../database/dbconnect.js");
const bcrypt = require("bcrypt");
const escape = require("escape-html");
const joi = require("joi");
const auth = require("../../middlewares/auth.js");
const router = express.Router();

// Joi schema for validation provided object
const passwordObjectSchema = joi.object().keys({
  password: joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
  repeat_password: joi.ref("password"),
});

// Escape html tags in input
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

// Fetch user password from db to compare
const fetchPassword = async (req) => {
  const fetchedPassword = await connectionPool.query(
    `SELECT user_password FROM users
        WHERE email = '${req.user}'`
  );
  return fetchedPassword[0][0].user_password;
};

// Delete user from db
const deleteUser = async (req) => {
  const deletedUser = await connectionPool.query(
    `DELETE FROM users
        WHERE email = '${req.user}'`
  );
  return deletedUser;
};

router.delete("/delete-user", auth, async (req, res) => {
  try {
    const providedObject = await req.body;
    // Escape html tags in input
    const passwordObject = escapeHTML(providedObject);
    // Validate input
    const validationResult = passwordObjectSchema.validate(passwordObject);
    if (validationResult.error) {
      return res.status(400).json(validationResult.error.details[0].message);
    }
    // Check if password is right
    const passwordFromDB = await fetchPassword(req);
    if (!passwordFromDB) {
      return res.status(500).json("Something Went Wrong!");
    }
    const isPasswordRight = await bcrypt.compare(
      passwordObject.password,
      passwordFromDB
    );
    if (!isPasswordRight) {
      return res.status(400).json("Wrong Credentials!");
    }
    // Delete User
    const deletedUser = await deleteUser(req);
    if (!deletedUser) {
      return res.status(500).json("Something Went Wrong");
    } else {
      return res.status(202).json("User Successfully Deleted!");
    }
  } catch (err) {
    return res.status(500).json(err.message);
  }
});

module.exports = router;
