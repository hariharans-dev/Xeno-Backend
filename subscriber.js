require("dotenv").config({ path: env });
const { subscribeToChannel } = require("./redisclient");

const { create_customer } = require("./route-controller/customer-controller");
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
  console.log("create customer", message);
  try {
    await create_customer(message);
  } catch (error) {
    console.error("Error handling message on create_customer:", error);
  }
});

subscribeToChannel("update_segment_on_customer_addition", async (message) => {
  console.log("update segment", message);
  try {
    await update_segment_on_customer_addition(message);
  } catch (error) {
    console.error("Error handling message on create_customer:", error);
  }
});

subscribeToChannel("check_active_campaign", async (message) => {
  console.log("check active campaign", message);
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
