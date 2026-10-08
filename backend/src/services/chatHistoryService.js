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
    userId,
    role,
    content
  ) => {

    return Chat.findOneAndUpdate(
      {
        _id: chatId,
        user_id: userId,
      },
      {
        $push: {
          messages: {
            $each: [{ role, content }],
            // Keep chat documents comfortably below MongoDB's document limit.
            $slice: -100,
          },
        },

        updated_at:
          new Date(),
      }
    );
  };

exports.getChatHistory =
  async (
    userId,
    { offset = 0, limit = 25 } = {}
  ) => {

    const filter = {
      user_id: userId,
      "messages.0": {
        $exists: true,
      },
    };

    const [chats, total] = await Promise.all([
      Chat.aggregate([
        { $match: filter },
        { $sort: { updated_at: -1, _id: -1 } },
        { $skip: offset },
        { $limit: limit },
        {
          $project: {
            user_id: 1,
            updated_at: 1,
            created_at: 1,
            messages: { $slice: ["$messages", 1] },
            messageCount: { $size: "$messages" },
          },
        },
      ]),
      Chat.countDocuments(filter),
    ]);

    return {
      chats,
      total,
      offset,
      limit,
      hasMore: offset + chats.length < total,
    };
  };

exports.getChatById =
  async (
    chatId,
    userId
  ) => {

    return Chat.findOne({
      _id: chatId,
      user_id: userId,
    });
  };
