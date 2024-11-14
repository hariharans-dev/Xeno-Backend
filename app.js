require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { createPool } = require("mysql2");

const app = express();
app.use(express.json());
app.use(cors());

const authRoutes = require("./routes/authentication-router");

const port = 3000;

app.use("/api/auth", authRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
