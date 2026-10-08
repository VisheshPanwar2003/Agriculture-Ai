const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoUri =
      process.env.MONGODB_URI ||
      process.env.MONGODB_URL;

    if (!mongoUri) {
      throw new Error("MONGODB_URI must be set in backend/.env");
    }

    await mongoose.connect(mongoUri);

    console.log(
      "MongoDB Connected"
    );
  } catch (error) {
    console.error(
      "MongoDB Error:",
      error.message
    );

    process.exit(1);
  }
};

module.exports = connectDB;
