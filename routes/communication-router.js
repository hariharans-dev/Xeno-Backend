const express = require("express");
const { validationResult } = require("express-validator");
const { display } = require("../route-controller/communication-controller");
const {
  authenticateJWT,
} = require("../route-controller/authentication-controller");

const router = express.Router();

const validatedisplay = [authenticateJWT];

const handlevalidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.get("/display", validatedisplay, handlevalidationErrors, display);

module.exports = router;
