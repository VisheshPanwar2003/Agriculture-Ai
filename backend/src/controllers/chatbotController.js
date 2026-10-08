const chatbot =
  require("../services/chatbotService");

const {
  createChat,
  saveMessage,
  getChatHistory,
  getChatById,
} = require(
  "../services/chatHistoryService"
);

exports.newChat =
  async (req, res) => {

    const chatId =
      await createChat(
        req.user.user_id
      );

    res.json({
      chat_id: chatId,
    });
  };

exports.chat =
  async (req, res) => {

    const {
      chat_id,
      message,
    } = req.body;

    if (typeof message !== "string" || !message.trim() || message.length > 4000) {
      return res.status(400).json({
        detail: "Message must contain 1 to 4000 characters",
      });
    }

    if (typeof chat_id !== "string" || !/^[a-f\d]{24}$/i.test(chat_id)) {
      return res.status(400).json({
        detail: "A valid chat ID is required",
      });
    }

    const chat = await saveMessage(
      chat_id,
      req.user.user_id,
      "user",
      message
    );

    if (!chat) {
      return res.status(404).json({
        detail: "Chat not found",
      });
    }

    const response =
      await chatbot.chat(
        message,
        chat.messages
      );

    await saveMessage(
      chat_id,
      req.user.user_id,
      "assistant",
      response
    );

    res.json({
      response,
    });
  };

exports.history =
  async (req, res) => {

    const chats =
      await getChatHistory(
        req.user.user_id
      );

    res.json(chats);
  };

exports.getChat =
  async (req, res) => {

    if (!/^[a-f\d]{24}$/i.test(req.params.chat_id)) {
      return res.status(400).json({
        detail: "A valid chat ID is required",
      });
    }

    const chat =
      await getChatById(
        req.params.chat_id,
        req.user.user_id
      );

    if (!chat) {
      return res.status(404).json({
        detail: "Chat not found",
      });
    }

    res.json(chat);
  };
