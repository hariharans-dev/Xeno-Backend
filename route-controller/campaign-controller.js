const { Campaign } = require("../data-controller/campaign-datacontroller");
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
    await Campaign.createcampaign(
      name,
      segment_id,
      message,
      start_date,
      end_date
    );
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
