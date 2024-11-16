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

  static resetDatabase() {
    return new Promise((resolve, reject) => {
      // Start by disabling foreign key checks
      let query = "SET FOREIGN_KEY_CHECKS = 0;";
      connection.query(query, (err, results) => {
        if (err) {
          return reject(err);
        }

        // Delete all data from the tables
        const deleteQueries = [
          "DELETE FROM customers;",
          "DELETE FROM segment;",
          "DELETE FROM campaign;",
          "DELETE FROM communication;",
        ];

        // Execute all delete queries sequentially
        Promise.all(
          deleteQueries.map((query) => {
            return new Promise((resolve, reject) => {
              connection.query(query, (err, results) => {
                if (err) {
                  return reject(err);
                }
                resolve(results);
              });
            });
          })
        )
          .then(() => {
            // Reset AUTO_INCREMENT for 'customers' table
            const resetQueries = [
              "ALTER TABLE customers AUTO_INCREMENT = 1;",
              "ALTER TABLE segment AUTO_INCREMENT = 1;",
              "ALTER TABLE campaign AUTO_INCREMENT = 1;",
              "ALTER TABLE communication AUTO_INCREMENT = 1;",
            ];

            // Execute all reset queries
            Promise.all(
              resetQueries.map((query) => {
                return new Promise((resolve, reject) => {
                  connection.query(query, (err, results) => {
                    if (err) {
                      return reject(err);
                    }
                    resolve(results);
                  });
                });
              })
            )
              .then(() => {
                // Re-enable foreign key checks
                query = "SET FOREIGN_KEY_CHECKS = 1;";
                connection.query(query, (err, results) => {
                  if (err) {
                    return reject(err);
                  }
                  resolve(
                    "Database reset and AUTO_INCREMENT set successfully."
                  );
                });
              })
              .catch(reject);
          })
          .catch(reject);
      });
    });
  }

  static resetDatabase() {
    return new Promise((resolve, reject) => {
      let query = "SET FOREIGN_KEY_CHECKS = 0;";
      connection.query(query, (err, results) => {
        if (err) {
          return reject(err);
        }

        const deleteQueries = [
          "DELETE FROM customers;",
          "DELETE FROM segment;",
          "DELETE FROM campaign;",
          "DELETE FROM communication;",
        ];

        Promise.all(
          deleteQueries.map((query) => {
            return new Promise((resolve, reject) => {
              connection.query(query, (err, results) => {
                if (err) {
                  return reject(err);
                }
                resolve(results);
              });
            });
          })
        )
          .then(() => {
            const resetQueries = [
              "ALTER TABLE customers AUTO_INCREMENT = 1;",
              "ALTER TABLE segment AUTO_INCREMENT = 1;",
              "ALTER TABLE campaign AUTO_INCREMENT = 1;",
              "ALTER TABLE communication AUTO_INCREMENT = 1;",
            ];

            Promise.all(
              resetQueries.map((query) => {
                return new Promise((resolve, reject) => {
                  connection.query(query, (err, results) => {
                    if (err) {
                      return reject(err);
                    }
                    resolve(results);
                  });
                });
              })
            )
              .then(() => {
                query = "SET FOREIGN_KEY_CHECKS = 1;";
                connection.query(query, (err, results) => {
                  if (err) {
                    return reject(err);
                  }
                  resolve(
                    "Database reset and AUTO_INCREMENT set successfully."
                  );
                });
              })
              .catch(reject);
          })
          .catch(reject);
      });
    });
  }
}

module.exports = { User };
