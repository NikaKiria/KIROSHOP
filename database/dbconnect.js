const mysql = require("mysql2");
const dotenv = require("dotenv");
dotenv.config({ path: `${__dirname}/../env/.env` });

const envVariables = process.env;

let connectionPool;

try {
  // Function connecting app to mysql
  const pool = mysql.createPool({
    host: envVariables.HOST,
    user: envVariables.USER,
    password: envVariables.PASSWORD,
    database: envVariables.DATABASE,
    connectionLimit: 100,
  });
  connectionPool = pool.promise();
  console.log("Connected to mysql");
} catch (err) {
  console.log(err);
}

module.exports = connectionPool;
