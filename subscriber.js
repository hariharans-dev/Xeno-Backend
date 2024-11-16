const { subscribeToChannel } = require("./redisclient");
const {
  update_segment_on_customer_addition,
} = require("./route-controller/segment-controller");
const {
  check_active_campaign,
} = require("./route-controller/campaign-controller");

const {
  send_message_to_customer,
} = require("./route-controller/communication-controller");

subscribeToChannel("create_customer", async (message) => {
  try {
    await update_segment_on_customer_addition(message);
  } catch (error) {
    console.error("Error handling message on create_customer:", error);
  }
});

subscribeToChannel("check_active_campaign", async (message) => {
  try {
    try {
      await check_active_campaign(message);
    } catch (error) {
      console.log("error finding the campaign");
    }
  } catch (error) {
    console.error("Error handling message on add_customer_to_campaign:", error);
  }
});

subscribeToChannel("send_message_to_customer", async (message) => {
  try {
    try {
      await send_message_to_customer(message);
    } catch (error) {
      console.log("error finding the campaign");
    }
  } catch (error) {
    console.error("Error handling message on add_customer_to_campaign:", error);
  }
});
