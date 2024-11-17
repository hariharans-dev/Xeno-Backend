const path = require("path");
const multer = require("multer");
const fs = require("fs");

const { Customer } = require("../data-controller/customer-datacontroller");
const { publishMessage } = require("../redisclient");
const { convertToCSV, convertCSVToObject } = require("./functions");

async function sendMessageToChannel(channel, message) {
  try {
    await publishMessage(channel, message);
  } catch (error) {
    console.error("Error sending message:", error);
  }
}

const register = async (req, res) => {
  const data = req.body;
  await sendMessageToChannel("create_customer", data);
  try {
    res.json({ body: "user created" });
  } catch (error) {
    if (error === "customer exists") {
      res.json({ body: "customer already exists" });
    } else {
      res.status(500).json({ body: "internal server error" });
    }
  }
};

const register_file = async (req, res) => {
  try {
    const filename = req.body.filename + ".csv";
    convertCSVToObject("uploads/" + filename, (err, data) => {
      if (err) {
        return res.status(500).json({ message: "Error processing the file" });
      }
      const requiredFields = [
        "email",
        "name",
        "total_spending",
        "visits",
        "last_visit",
      ];

      data.forEach((item, index) => {
        requiredFields.forEach((field) => {
          if (!item[field]) {
            res.status(409).json({ message: "invalid file data" });
          }
        });
      });

      data.forEach((item) => {
        sendMessageToChannel("create_customer", item);
        console.log(item);
      });

      res.json({ message: "customers added" });
    });
  } catch (error) {
    res.status(500).json({ message: "internal server error", error });
  }
};

const create_customer = async (data) => {
  const { name, email, total_spending, visits, last_visit } = data;
  console.log(data);
  const result = await Customer.createcustomer(
    name,
    email,
    total_spending,
    visits,
    last_visit
  );
  const message = {
    customer_id: result.insertId,
    email: email,
    total_spending: total_spending,
    visits: visits,
    last_visit: last_visit,
  };
  sendMessageToChannel("update_segment_on_customer_addition", message);
};

const display = async (req, res) => {
  try {
    const result = await Customer.findcustomer(10);
    res.json({ message: "success", data: result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
};

const display_file = async (req, res) => {
  try {
    const result = await Customer.findcustomer(10);
    const filepath = convertToCSV(result);

    res.sendFile(filepath, (err) => {
      if (err) {
        res.status(500).json({ message: "internal server error" });
      }
      fs.unlink(filepath, (unlinkErr) => {});
    });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};

module.exports = {
  create_customer,
  register,
  register_file,
  display,
  display_file,
};
