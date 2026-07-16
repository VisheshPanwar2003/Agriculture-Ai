const express = require("express");

const {
  getDailyAlmanac,
  getSeasonalGuide,
  getCropAIData,
} = require("../controllers/almanacController");

const router = express.Router();

router.get(
  "/daily",
  getDailyAlmanac
);

router.get(
  "/seasonal/:region",
  getSeasonalGuide
);

router.get(
  "/crop-ai/:crop_name",
  getCropAIData
);

module.exports = router;