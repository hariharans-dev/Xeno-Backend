const { connection } = require("./db");

class Segment {
  static createsegment(name, conditions, customer_count) {
    return new Promise((resolve, reject) => {
      const query =
        "INSERT INTO segment (name, conditions, customer_count) VALUES (?, ?, ?)";
      const conditionsJSON = JSON.stringify(conditions);
      connection.query(
        query,
        [name, conditionsJSON, customer_count],
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
  static findsegment(id = null) {
    if (id === null) {
      return new Promise((resolve, reject) => {
        const query = "SELECT id, conditions FROM segment";

        connection.query(query, (err, results) => {
          if (err) {
            reject(err);
            return;
          }
          try {
            const processedResults = results.map((row) => {
              let parsedConditions;
              try {
                parsedConditions = JSON.parse(row.conditions);
              } catch (parseError) {
                parsedConditions = row.conditions;
              }
              return {
                ...row,
                conditions: parsedConditions,
              };
            });
            resolve(processedResults);
          } catch (error) {
            reject(new Error("unexpected error processing results"));
          }
        });
      });
    } else {
      return new Promise((resolve, reject) => {
        const query = "SELECT conditions FROM segment where id = (?)";

        connection.query(query, [id], (err, results) => {
          if (err) {
            reject(err);
            return;
          }
          try {
            const processedResults = results.map((row) => {
              let parsedConditions;
              try {
                parsedConditions = JSON.parse(row.conditions);
              } catch (parseError) {
                parsedConditions = row.conditions;
              }
              return {
                ...row,
                conditions: parsedConditions,
              };
            });
            resolve(processedResults);
          } catch (error) {
            reject(new Error("unexpected error processing results"));
          }
        });
      });
    }
  }

  static incrementCustomerCount(segmentId) {
    return new Promise((resolve, reject) => {
      const query =
        "UPDATE segment SET customer_count = customer_count + 1 WHERE id = ?";

      connection.query(query, [segmentId], (err, results) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(results);
      });
    });
  }

  static findallsegment(limit) {
    return new Promise((resolve, reject) => {
      const query =
        "SELECT id, name, conditions, customer_count FROM segment LIMIT ?";
      connection.query(query, [limit || 999999999], (err, results) => {
        if (err) {
          reject(err);
          return;
        }
        try {
          const processedResults = results.map((row) => {
            let parsedConditions;
            try {
              parsedConditions = JSON.parse(row.conditions);
            } catch (parseError) {
              parsedConditions = row.conditions;
            }
            return {
              ...row,
              conditions: parsedConditions,
            };
          });
          resolve(processedResults);
        } catch (error) {
          reject(new Error("unexpected error processing results"));
        }
      });
    });
  }
}

module.exports = { Segment };
