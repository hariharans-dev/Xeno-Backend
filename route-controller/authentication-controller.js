const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const bcrypt = require("bcryptjs");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const {
  fetchData,
} = require("../data-controller/authentication-datacontroller");

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = {
    email: "test@example.com",
    password: "$2a$10$3E2f7lZg9hT1gkZmOfr/.n.P.sJp1iM1.5wYPjN9OTMjgqJtu.xjS",
  };

  if (user && (await bcrypt.compare(password, user.password))) {
    const authToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
      expiresIn: process.env.USER_EXPIRE_TIME,
    });
    res.json({ token: authToken, user });
  } else {
    res.status(401).send("Invalid credentials");
  }
};

const googleauth = async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = { email: payload.email };

    const authToken = jwt.sign(email, process.env.JWT_SECRET, {
      expiresIn: process.env.USER_EXPIRE_TIME,
    });

    console.log(authToken);
    res.json({ token: authToken });
  } catch (error) {
    console.error("Error verifying Google token:", error);
    res.status(400).send("Invalid Google token");
  }
};

const session = async (req, res) => {
  await fetchData();
  console.log(req.body);
  res.json({ body: "session is active" });
};

const authenticateJWT = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).send("Access Denied");

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ body: "session expired" });
      }
      return res.status(403).json({ body: "invalid token" });
    }

    // If the token is valid, decoded will contain the payload (like email)
    console.log(decoded); // Log the decoded data, typically { email: 'user@example.com' }
    req.body = decoded; // Attach the decoded data (email in this case) to the request body
    next();
  });
};

module.exports = {
  login,
  googleauth,
  session,
  authenticateJWT,
};
