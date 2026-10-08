const express =
  require("express");

const {
  getWeather,
} = require("../controllers/weatherController");
const authMiddleware = require("../middleware/authMiddleware");

const router =
  express.Router();

router.get(
  "/:city",
  authMiddleware,
  getWeather
);

module.exports =
  router;
