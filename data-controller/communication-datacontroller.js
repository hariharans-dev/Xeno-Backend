const { connection } = require("./db");

class Communication {
  static createlog(campaign_id, customer_id, email, delivery_status, message) {
    return new Promise((resolve, reject) => {
      const query =
        "INSERT INTO communication (campaign_id, customer_id, email, delivery_status, message) VALUES (?, ?, ?, ?, ?)";
      connection.query(
        query,
        [campaign_id, customer_id, email, delivery_status, message],
        (err, results) => {
          if (err) {
            console.log(err);
            reject(err);
            return;
          }
          resolve(results);
        }
      );
    });
  }
  static findcommunication(limit) {
    return new Promise((resolve, reject) => {
      const query =
        "SELECT campaign_id, email, delivery_status, delivery_date, message FROM communication LIMIT ?";
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

module.exports = { Communication };
