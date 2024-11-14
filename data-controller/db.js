const mysql = require("mysql2");
require("dotenv").config();

// Create the connection
var connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

console.log("Connecting to:", process.env.DB_HOST);

// Connect to the database
connection.connect(function (err) {
  if (err) {
    console.error("Database connection failed: " + err.stack);
    return;
  }

  console.log("Connected to database.");
});

// Export the connection to use it in other files
module.exports = connection;
