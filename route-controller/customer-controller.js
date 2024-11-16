const { Customer } = require("../data-controller/customer-datacontroller");
const { publishMessage } = require("../redisclient");

async function sendMessageToChannel(message) {
  try {
    await publishMessage("create_customer", message);
  } catch (error) {
    console.error("Error sending message:", error);
  }
}

const register = async (req, res) => {
  const { name, email, total_spending, visits, last_visit } = req.body;

  try {
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
    sendMessageToChannel(message);

    res.json({ body: "user created" });
  } catch (error) {
    if (error === "customer exists") {
      res.json({ body: "customer already exists" });
    } else {
      res.status(500).json({ body: "internal server error" });
    }
  }
};

module.exports = {
  register,
};
