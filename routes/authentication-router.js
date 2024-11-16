const express = require("express");
const { check, validationResult } = require("express-validator");
const {
  register,
  googleregister,
  login,
  googlelogin,
  session,
  removedatabase,
  authenticateJWT,
} = require("../route-controller/authentication-controller");

const router = express.Router();

const validateregister = [
  check("email").isEmail().withMessage("Please provide a valid email address"),
  check("password")
    .exists()
    .withMessage("Password must be at least 6 characters"),
];

const validatelogin = [
  check("email").isEmail().withMessage("Please provide a valid email address"),
  check("password").exists().withMessage("Password is required"),
];

const validateBearerToken = [authenticateJWT];

const handlevalidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.post("/register", validateregister, handlevalidationErrors, register);

router.post("/googleregister", googleregister);

router.post("/login", validatelogin, handlevalidationErrors, login);

router.post("/googlelogin", googlelogin);

router.get("/session", validateBearerToken, handlevalidationErrors, session);

router.get(
  "/removedatabase",
  validateBearerToken,
  handlevalidationErrors,
  removedatabase
);

module.exports = router;
