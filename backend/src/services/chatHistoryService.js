const Chat =
  require("../models/Chat");

exports.createChat =
  async (userId) => {

    const chat =
      await Chat.create({
        user_id: userId,
        messages: [],
      });

    return chat._id;
  };

exports.saveMessage =
  async (
    chatId,
    role,
    content
  ) => {

    await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: {
          messages: {
            role,
            content,
          },
        },

        updated_at:
          new Date(),
      }
    );
  };

exports.getChatHistory =
  async (
    userId
  ) => {

    return Chat.find({
      user_id: userId,
      "messages.0": {
        $exists: true,
      },
    }).sort({
      updated_at: -1,
    });
  };

exports.getChatById =
  async (
    chatId
  ) => {

    return Chat.findById(
      chatId
    );
  };