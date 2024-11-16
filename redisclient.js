const { createClient } = require("redis");

const redisSubscriber = createClient({
  url: "redis://127.0.0.1:6379",
});
const redisPublisher = createClient({
  url: "redis://127.0.0.1:6379",
});

redisSubscriber.connect().catch((err) => {
  console.error("Error connecting subscriber to Redis:", err);
});
redisPublisher.connect().catch((err) => {
  console.error("Error connecting publisher to Redis:", err);
});

async function subscribeToChannel(channel, callback) {
  try {
    await redisSubscriber.subscribe(channel, (message) => {
      callback(JSON.parse(message));
    });
  } catch (error) {
    console.error("Error subscribing to channel:", error);
  }
}

async function publishMessage(channel, message) {
  try {
    await redisPublisher.publish(channel, JSON.stringify(message));
  } catch (error) {
    console.error("Error publishing message:", error);
  }
}

module.exports = {
  subscribeToChannel,
  publishMessage,
};
