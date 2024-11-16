const { connection } = require("./db");

class User {
  static createuser(email, password) {
    return new Promise((resolve, reject) => {
      const query = "INSERT INTO users (email, password) VALUES (?, ?)";
      connection.query(query, [email, password], (err, results) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            reject("email exists");
            return;
          }
          reject(err);
          return;
        }
        resolve(results);
      });
    });
  }

  static finduser(email, password = null) {
    return new Promise((resolve, reject) => {
      let query = "";
      let queryParams = [email];

      if (password === null) {
        query = "SELECT * FROM users WHERE email = ?";
      } else {
        query = "SELECT * FROM users WHERE email = ? AND password = ?";
        queryParams.push(password);
      }

      connection.query(query, queryParams, (err, results) => {
        if (err) {
          console.error("Error fetching data:", err.stack);
          reject(err);
          return;
        }

        if (results.length === 0) {
          reject("User not found");
          return;
        }

        resolve(results);
      });
    });
  }
}

module.exports = { User };
