const { connection } = require("./db");

class Customer {
  static createcustomer(name, email, total_spending, visits, last_visit) {
    return new Promise((resolve, reject) => {
      const query =
        "INSERT INTO customers (name, email, total_spending, visits, last_visit) VALUES (?, ?, ?, ?, ?)";
      connection.query(
        query,
        [name, email, total_spending, visits, last_visit],
        (err, results) => {
          if (err) {
            if (err.code === "ER_DUP_ENTRY") {
              reject("customer exists");
              return;
            }
            reject(err);
            return;
          }
          resolve(results);
        }
      );
    });
  }

  static search_count(condition) {
    return new Promise((resolve, reject) => {
      const query = `SELECT COUNT(*) AS COUNT FROM customers WHERE ${condition}`;
      connection.query(query, (err, results) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(results);
      });
    });
  }

  static get_customer(condition) {
    return new Promise((resolve, reject) => {
      const query = `SELECT id, email FROM customers WHERE ${condition}`;
      connection.query(query, (err, results) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(results);
      });
    });
  }

  static findcustomer(limit) {
    return new Promise((resolve, reject) => {
      const query =
        "SELECT name, email, total_spending, visits, last_visit FROM customers LIMIT ?";
      connection.query(query, [limit || 999999999], (err, results) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(results);
      });
    });
  }
}

module.exports = { Customer };
