const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token) {
      return res.status(401).json("Authorization Denied!");
    }
    // Verify Token
    const verifiedToken = jwt.verify(token, process.env.JWT_SECRET_TOKEN);
    if (!verifiedToken) {
      return res.status(401).json("Authorization Denied!");
    }
    req.user = verifiedToken.email;
    next();
  } catch (err) {
    return res.status(500).json("Bad Request!");
  }
};

module.exports = auth;
