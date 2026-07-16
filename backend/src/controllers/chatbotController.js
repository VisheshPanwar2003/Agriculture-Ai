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

    await saveMessage(
      chat_id,
      "user",
      message
    );

    const response =
      await chatbot.chat(
        message
      );

    await saveMessage(
      chat_id,
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

    const chat =
      await getChatById(
        req.params.chat_id
      );

    res.json(chat);
  };