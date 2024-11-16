const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

function convertToCSV(data) {
  const headers = Object.keys(data[0]).join(",") + "\n";
  const randomFilename = `output_${Date.now()}_${Math.floor(
    Math.random() * 10000
  )}.csv`;
  const rows = data
    .map((row) =>
      Object.values(row)
        .map((value) => (typeof value === "string" ? `"${value}"` : value))
        .join(",")
    )
    .join("\n");
  const csv = headers + rows;
  const filePath = path.join(__dirname, "files", randomFilename);
  fs.writeFileSync(filePath, csv, "utf8");
  return filePath;
}
function convertCSVToObject(filePath, callback) {
  const results = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", () => {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
          return callback(err, null);
        }
        callback(null, results);
      });
    })
    .on("error", (err) => {
      callback(err, null);
    });
}

module.exports = { convertToCSV, convertCSVToObject };
