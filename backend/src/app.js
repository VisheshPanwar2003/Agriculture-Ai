require("dotenv").config();

const express = require("express");
const cors = require("cors");
const multer = require("multer");

const analysisRoutes = require("./routes/analysisRoutes");
const chatbotRoutes = require("./routes/chatbotRoutes");
const weatherRoutes = require("./routes/weatherRoutes");
const almanacRoutes = require("./routes/almanacRoutes");
const visionRoutes = require("./routes/visionRoutes");
const authRoutes = require("./routes/authRoutes");
const marketRoutes = require("./routes/marketRoutes");
const schemeRoutes = require("./routes/schemeRoutes");

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://agriculture-ai-frontend.vercel.app",
  ],
  credentials: true,
}));
app.use(express.json({ limit: "1mb" }));

app.use("/analysis", analysisRoutes);
app.use("/chatbot", chatbotRoutes);
app.use("/weather", weatherRoutes);
app.use("/almanac", almanacRoutes);
app.use("/vision", visionRoutes);
app.use("/auth", authRoutes);
app.use("/market", marketRoutes);
app.use("/schemes", schemeRoutes);

app.get("/", (req, res) => {
  res.json({ message: "AgriSense AI Backend Running" });
});

app.use((err, req, res, next) => {
  const status = err instanceof multer.MulterError
    ? (err.code === "LIMIT_FILE_SIZE" ? 413 : 400)
    : (err.statusCode || (err instanceof SyntaxError ? 400 : 500));

  if (status >= 500) console.error(err);

  res.status(status).json({
    error: status >= 500 ? "Server Error" : err.message,
  });
});

module.exports = app;
