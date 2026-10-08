const jwt =
  require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (
  req,
  res,
  next
) => {

  try {

    const authHeader =
      req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {

      return res
        .status(401)
        .json({
          detail:
            "Unauthorized",
        });
    }

    const token = authHeader.slice(7).trim();
    if (!token) {
      return res.status(401).json({
        detail: "Unauthorized",
      });
    }

    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );

    const user = await User.findById(decoded.user_id).select("tokenVersion");
    if (!user || (decoded.token_version || 0) !== (user.tokenVersion || 0)) {
      return res.status(401).json({ detail: "Session expired. Please sign in again." });
    }

    req.user = decoded;

    next();

  } catch {

    res.status(401).json({
      detail: "Invalid token",
    });
  }
};
