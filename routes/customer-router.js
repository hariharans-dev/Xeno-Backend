const express = require("express");
const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    const name = Date.now();
    cb(null, name + path.extname(file.originalname));
    req.body.filename = name;
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
}).single("file");

const { check, validationResult } = require("express-validator");
const {
  register,
  register_file,
  display,
  display_file,
} = require("../route-controller/customer-controller");
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
const validateregisterfile = [
  upload,
  (req, res, next) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    next();
  },
  authenticateJWT,
];
const validaterdisplay = [authenticateJWT];
const validaterdisplayfile = [authenticateJWT];

const handlevalidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.post("/register", validateregister, handlevalidationErrors, register);
router.post(
  "/registerfile",
  validateregisterfile,
  handlevalidationErrors,
  register_file
);
router.get("/display", validaterdisplay, handlevalidationErrors, display);
router.get(
  "/displayfile",
  validaterdisplayfile,
  handlevalidationErrors,
  display_file
);

module.exports = router;
