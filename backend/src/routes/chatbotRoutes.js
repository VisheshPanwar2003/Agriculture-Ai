const express = require("express");

const {
  newChat,
  chat,
  history,
  getChat,
} = require("../controllers/chatbotController");

const authMiddleware =
  require("../middleware/authMiddleware");

const router =
  express.Router();

router.post(
  "/new",
  authMiddleware,
  newChat
);

router.post(
  "/chat",
  authMiddleware,
  chat
);

router.get(
  "/history",
  authMiddleware,
  history
);

router.get(
  "/:chat_id",
  authMiddleware,
  getChat
);

module.exports = router;
