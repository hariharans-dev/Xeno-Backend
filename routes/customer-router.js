const express = require("express");
const { check, validationResult } = require("express-validator");
const { register } = require("../route-controller/customer-controller");
const {
  authenticateJWT,
} = require("../route-controller/authentication-controller");

const router = express.Router();

const validateregister = [
  check("email").isEmail().withMessage("Please provide a valid email address"),
  check("name").exists().withMessage("Please provide a valid name"),
  check("total_spending")
    .exists()
    .withMessage("Please provide a valid spending data"),
  check("visits").exists().withMessage("Please provide a valid visit count"),
  check("last_visit").exists().withMessage("Please provide a last visit date"),
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
