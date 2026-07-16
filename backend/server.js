require("dotenv").config();

const express = require("express");
const cors = require("cors");

// DATABASE
const connectDB = require("./src/config/database");

// ROUTES
const analysisRoutes = require("./src/routes/analysisRoutes");
const chatbotRoutes = require("./src/routes/chatbotRoutes");
const weatherRoutes = require("./src/routes/weatherRoutes");
const almanacRoutes = require("./src/routes/almanacRoutes");
const visionRoutes = require("./src/routes/visionRoutes");
const authRoutes = require("./src/routes/authRoutes");

const app = express();

// CONNECT DATABASE
connectDB();

// MIDDLEWARE
app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://agriculture-ai-frontend.vercel.app",
    ],
    credentials: true,
  })
);

// ROUTES
app.use("/analysis", analysisRoutes);
app.use("/chatbot", chatbotRoutes);
app.use("/weather", weatherRoutes);
app.use("/almanac", almanacRoutes);
app.use("/vision", visionRoutes);
app.use("/auth", authRoutes);

// HOME ROUTE
app.get("/", (req, res) => {
  res.json({
    message: "AgriSense AI Backend Running",
  });
});

// ERROR HANDLER
app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    error: err.message || "Server Error",
  });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});