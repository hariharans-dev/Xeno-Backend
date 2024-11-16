const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const bcrypt = require("bcryptjs");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const { User } = require("../data-controller/authentication-datacontroller");
const { body } = require("express-validator");

const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    await User.createuser(email, password);
    res.json({ body: "user created" });
  } catch (error) {
    if (error === "email exists") {
      res.json({ body: "email already exists" });
    } else {
      res.status(500).json({ body: "internal server error" });
    }
  }
};

const googleregister = async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload.email;
    const password = payload.sub;

    await User.createuser(email, password);
    res.json({ body: "user created" });
  } catch (error) {
    if (error === "email exists") {
      res.json({ body: "email already exists" });
    } else {
      res.status(500).json({ body: "internal server error" });
    }
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const users = await User.finduser(email, password);
    if (users.length === 0) {
      return res.status(401).json({ body: "user not found" });
    }

    const authToken = jwt.sign(
      { email: users[0].email },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.USER_EXPIRE_TIME,
      }
    );

    res.json({ token: authToken, body: "login success" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ body: "internal server error" });
  }
};

const googlelogin = async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload.email;

    const users = await User.finduser(email);
    if (users.length === 0) {
      res.json({ body: "user not found" });
    } else {
      const authToken = jwt.sign({ email: email }, process.env.JWT_SECRET, {
        expiresIn: process.env.USER_EXPIRE_TIME,
      });
      res.json({ token: authToken, body: "login success" });
    }
  } catch (error) {
    res.status(400).send("Invalid Google token");
  }
};

const session = async (req, res) => {
  res.json({ message: "session is active" });
};

const authenticateJWT = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ body: "Access Denied" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ body: "session expired" });
      }
      return res.status(403).json({ body: "invalid token" });
    }

    req.body.decoded = decoded;
    next();
  });
};

const removedatabase = async (req, res) => {
  try {
    await User.resetDatabase();
    res.json({ message: "databases removed" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
};

module.exports = {
  authenticateJWT,
  register,
  googleregister,
  login,
  googlelogin,
  session,
  removedatabase,
};
