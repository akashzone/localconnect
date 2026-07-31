
const jwt = require("jsonwebtoken");
const authMiddleware = (req, res, next) => {
  const token = req.cookies.accessToken;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError") {
      console.log(`Auth failed: ${error.message}`);
    } else {
      console.error("Unexpected Auth Error:", error);
    }
    return res.status(401).json({
      message: error.message,
    });
  }
};

module.exports = authMiddleware;
