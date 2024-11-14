const connection = require("./db"); 

function fetchData() {
  connection.query("SHOW DATABASES;", (err, results) => {
    if (err) {
      console.error("Error fetching databases:", err.stack);
      return;
    }

    console.log("List of databases:");
    results.forEach((row) => {
      console.log(row.Database);
    });
  });
}

module.exports = { fetchData }; 
