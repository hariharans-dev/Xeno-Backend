const { connection } = require("./db");

class Communication {
  static createlog(campaign_id, customer_id, email, delivery_status, message) {
    return new Promise((resolve, reject) => {
      const query =
        "INSERT INTO communication (campaign_id, customer_id, email, delivery_status, message) VALUES (?, ?, ?, ?, ?)";
      console.log(campaign_id, customer_id, email, delivery_status, message);
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
}

module.exports = { Communication };
