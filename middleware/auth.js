const jwt = require("jsonwebtoken");
const config = require("config");
module.exports = function (req, res, next) {
  // Get token from header
  const token = req.header("x-auth-token");
  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: "No Token, Authorization Denied" });
  }
  // Verify Token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Token is Not Valid" });
  }
};
