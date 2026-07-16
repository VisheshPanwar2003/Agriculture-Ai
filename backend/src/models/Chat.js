const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
  user_id: String,

  messages: [
    {
      role: String,
      content: String,
    },
  ],

  created_at: {
    type: Date,
    default: Date.now,
  },

  updated_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model(
  "Chat",
  ChatSchema
);