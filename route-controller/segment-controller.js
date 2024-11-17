const { Segment } = require("../data-controller/segment-datacontroller");
const { Customer } = require("../data-controller/customer-datacontroller");
const { publishMessage } = require("../redisclient");

async function sendMessageToChannel(message) {
  try {
    await publishMessage("check_active_campaign", message);
  } catch (error) {
    console.error("Error sending message:", error);
  }
}

const evaluateExpression = (a, b, operator) => {
  switch (operator) {
    case ">":
      return a > b;
    case "<":
      return a < b;
    case ">=":
      return a >= b;
    case "<=":
      return a <= b;
    case "==":
      return a == b;
    case "===":
      return a === b;
    case "!=":
      return a != b;
    case "!==":
      return a !== b;
    default:
      throw new Error("Unsupported operator");
  }
};

const update_segment_on_customer_addition = async (data) => {
  const result = await Segment.findsegment();

  result.forEach(async (row) => {
    const segment_id = row.id;
    const conditions = JSON.parse(JSON.stringify(row.conditions));

    var passed = true;

    for (let i = 0; i < conditions.length; i++) {
      const field = conditions[i]["field"];
      const operator = conditions[i]["operator"];
      const value = conditions[i]["value"];

      const valid = evaluateExpression(data[field], value, operator);
      if (!valid) {
        passed = false;
        break;
      }
    }

    if (passed) {
      const message = {
        segment_id: segment_id,
        customer_id: data.customer_id,
        customer_email: data.email,
      };
      await Segment.incrementCustomerCount(segment_id);
      sendMessageToChannel(message);
    }
  });
};

const register = async (req, res) => {
  const { name, conditions } = req.body;
  console.log(req.body);

  var query =
    conditions[0].field +
    " " +
    conditions[0].operator +
    " " +
    conditions[0].value;

  for (let i = 1; i < conditions.length; i++) {
    const subquery =
      conditions[i].field +
      " " +
      conditions[i].operator +
      " " +
      conditions[i].value;
    query += " AND " + subquery;
  }

  const result = await Customer.search_count(query);
  try {
    await Segment.createsegment(name, conditions, result[0].COUNT);
    res.json({ body: "segment created" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ body: "internal server error" });
  }
};

const display = async (req, res) => {
  try {
    const result = await Segment.findallsegment();
    res.json({ message: "success", data: result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
};

module.exports = {
  register,
  update_segment_on_customer_addition,
  display,
};
