const express = require("express");
const { check, validationResult } = require("express-validator");
const { register, display } = require("../route-controller/segment-controller");
const {
  authenticateJWT,
} = require("../route-controller/authentication-controller");

const router = express.Router();

const validateregister = [
  check("name").exists().withMessage("Please provide a valid name"),
  check("conditions")
    .isArray({ min: 1 })
    .withMessage("Conditions must be a non-empty array")
    .custom((conditions) => {
      conditions.forEach((condition) => {
        if (
          !condition.field ||
          !condition.operator ||
          typeof condition.value === "undefined"
        ) {
          throw new Error(
            "Each condition must have a field, operator, and value"
          );
        }
        const validOperators = [">", ">=", "<", "<=", "=", "!="];
        if (!validOperators.includes(condition.operator)) {
          throw new Error(
            "Operator must be one of: " + validOperators.join(", ")
          );
        }

        const validFields = ["total_spending", "visits", "last_visit"];
        if (!validFields.includes(condition.field)) {
          throw new Error("Field must be one of: " + validFields.join(", "));
        }
      });
      return true;
    }),
  authenticateJWT,
];

const validatedisplay = [authenticateJWT];

const handlevalidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.post("/register", validateregister, handlevalidationErrors, register);

router.get("/display", validatedisplay, handlevalidationErrors, display);

module.exports = router;
