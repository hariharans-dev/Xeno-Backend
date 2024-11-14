const express = require("express");
const {
  login,
  googleauth,
  session,
  authenticateJWT,
} = require("../route-controller/authentication-controller");

const router = express.Router();

router.post("/login", login);

router.post("/google", googleauth);

router.get("/session", authenticateJWT, session);

module.exports = router;
