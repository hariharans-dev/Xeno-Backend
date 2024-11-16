const { connection } = require("./db");

class Campaign {
  static findActiveCampaign(segment_id) {
    return new Promise((resolve, reject) => {
      const query =
        "SELECT id, message FROM campaign WHERE segment_id = (?) AND CURDATE() BETWEEN start_date and end_date";

      connection.query(query, [segment_id], (err, results) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(results);
      });
    });
  }

  static createcampaign(name, segment_id, message, start_date, end_date) {
    return new Promise((resolve, reject) => {
      const query =
        "INSERT INTO campaign (name, segment_id, message, start_date, end_date) VALUES (?, ?, ?, ?, ?)";

      connection.query(
        query,
        [name, segment_id, message, start_date, end_date],
        (err, results) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(results);
        }
      );
    });
  }

  static incrementSuccessCount(campaign_id) {
    return new Promise((resolve, reject) => {
      const query =
        "UPDATE campaign SET success_count = success_count + 1 WHERE id = ?";

      connection.query(query, [campaign_id], (err, results) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(results);
      });
    });
  }

  static findcampaign(limit) {
    return new Promise((resolve, reject) => {
      const query =
        "SELECT id, name, segment_id, success_count, message, status, start_date, end_date FROM campaign LIMIT ?";
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

module.exports = { Campaign };
