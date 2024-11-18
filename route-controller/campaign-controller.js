const { Campaign } = require("../data-controller/campaign-datacontroller");
const { Segment } = require("../data-controller/segment-datacontroller");
const { Customer } = require("../data-controller/customer-datacontroller");
const { publishMessage } = require("../redisclient");

async function sendMessageToChannel(message) {
  try {
    await publishMessage("send_message_to_customer", message);
  } catch (error) {
    console.error("Error sending message:", error);
  }
}

const check_active_campaign = async (message) => {
  try {
    const segment_id = message.segment_id;
    const result = await Campaign.findActiveCampaign(segment_id);

    if (result.length > 0) {
      result.forEach((campaign) => {
        delete message.segment_id;
        message.campaign_id = campaign.id;
        message.message = campaign.message;
        sendMessageToChannel(message);
      });
    }
  } catch (error) {
    console.error("Error in check_active_campaign:", error);
    return error;
  }
};

const register = async (req, res) => {
  const { name, segment_id, message, start_date, end_date } = req.body;

  try {
    const campaign_result = await Campaign.createcampaign(
      name,
      segment_id,
      message,
      start_date,
      end_date
    );
    const campaign_id = campaign_result["insertId"];
    const segment_result = await Segment.findsegment(segment_id);
    const conditions = segment_result[0].conditions;

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
    const customers_result = await Customer.get_customer(query);
    for (let i = 0; i < customers_result.length; i++) {
      const data = {
        customer_id: customers_result[i]["id"],
        customer_email: customers_result[i]["email"],
        campaign_id: campaign_id,
        message: message,
      };
      sendMessageToChannel(data);
    }
    res.json({ body: "campaign created" });
  } catch (error) {
    if (error.message == "start end date error") {
      res.status(409).json({ body: "invalid start and end date" });
    } else if (error.message.includes("foreign key constraint fails")) {
      return res.status(400).json({
        body: "invalid segment",
      });
    } else {
      res.status(500).json({ body: "internal server error" });
    }
  }
};

const display = async (req, res) => {
  try {
    const result = await Campaign.findcampaign();
    res.json({ message: "success", data: result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
};

module.exports = {
  check_active_campaign,
  register,
  display,
};
