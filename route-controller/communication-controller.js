const {
  Communication,
} = require("../data-controller/communication-datacontroller");
const { Campaign } = require("../data-controller/campaign-datacontroller");

const send_message_to_customer = async (data) => {
  try {
    const randomchoice = Math.round(Math.random());
    const status = randomchoice == 1 ? "success" : "failed";
    await Communication.createlog(
      data.campaign_id,
      data.customer_id,
      data.customer_email,
      status,
      data.message
    );
    if (status == "success") {
      await Campaign.incrementSuccessCount(data.campaign_id);
    }
  } catch (error) {
    return error;
  }
};

module.exports = {
  send_message_to_customer,
};
