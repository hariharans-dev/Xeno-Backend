const express = require("express");
const { check, validationResult } = require("express-validator");
const { register } = require("../route-controller/campaign-controller");
const {
  authenticateJWT,
} = require("../route-controller/authentication-controller");

const router = express.Router();

const validateregister = [
  check("name").exists().withMessage("Please provide a valid name"),
  check("segment_id").exists().withMessage("Please provide a valid segment_id"),
  check("message").exists().withMessage("Please provide a valid message"),
  check("start_date")
    .exists()
    .withMessage("Please provide a valid start_date")
    .matches(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)
    .withMessage("start_date must be in the format YYYY-MM-DD"),
  check("end_date")
    .exists()
    .withMessage("Please provide a valid end_date")
    .matches(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)
    .withMessage("end_date must be in the format YYYY-MM-DD"),
  authenticateJWT,
];

const handlevalidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.post("/register", validateregister, handlevalidationErrors, register);

module.exports = router;
