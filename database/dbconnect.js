const res = require("express/lib/response");
const mysql = require("mysql2");

// Function connecting app to mysql
const connectToDB = (host, user, password, database) => {
  try {
    mysql
      .createConnection({
        host: host,
        user: user,
        password: password,
        database: database,
      })
      .connect((err) => {
        err && console.log(err);
        console.log("Connected to mysql database!");
      });
  } catch (err) {
    console.log(err);
    res.status(500).json("Server Error!");
  }
};

module.exports = connectToDB;
