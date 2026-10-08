const express = require("express");

const {
  getDailyAlmanac,
  getSeasonalGuide,
  getCropAIData,
} = require("../controllers/almanacController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/daily",
  authMiddleware,
  getDailyAlmanac
);

router.get(
  "/seasonal/:region",
  authMiddleware,
  getSeasonalGuide
);

router.get(
  "/crop-ai/:crop_name",
  authMiddleware,
  getCropAIData
);

module.exports = router;
