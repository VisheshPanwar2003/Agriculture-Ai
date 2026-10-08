const express = require("express");

const {
  signup,
  login,
  changePassword,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/signup",
  signup
);

router.post(
  "/login",
  login
);

router.post(
  "/change-password",
  authMiddleware,
  changePassword
);

module.exports = router;
