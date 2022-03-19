const { createPool } = require("mysql2");
const dotenv = require("dotenv");
dotenv.config({ path: `${__dirname}/../env/.env` });

const envVariables = process.env;

// Function connecting app to mysql
const connectionPool = createPool({
  host: envVariables.HOST,
  user: envVariables.USER,
  password: envVariables.PASSWORD,
  database: envVariables.DATABASE,
  connectionLimit: 10,
});

connectionPool.getConnection((err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log("Connected to MySql");
});

module.exports = connectionPool;
