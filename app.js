require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const authRoutes = require("./routes/authentication-router");
const customerRoutes = require("./routes/customer-router");
const segmentRoutes = require("./routes/segment-router");
const campaignRoutes = require("./routes/campaign-router");

const port = 3000;

app.use("/api/auth", authRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/segment", segmentRoutes);
app.use("/api/campaign", campaignRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
