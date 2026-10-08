const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { getMarketPrices } = require("../controllers/marketController");

const router = express.Router();
router.get("/prices", authMiddleware, getMarketPrices);

module.exports = router;
