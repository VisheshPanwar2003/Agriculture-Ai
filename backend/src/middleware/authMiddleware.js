const jwt =
  require("jsonwebtoken");

module.exports = (
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

    req.user = decoded;

    next();

  } catch {

    res.status(401).json({
      detail: "Invalid token",
    });
  }
};
