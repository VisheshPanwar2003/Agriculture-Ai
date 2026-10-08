const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { getSchemes } = require("../controllers/schemeController");

const router = express.Router();
router.get("/", authMiddleware, getSchemes);

module.exports = router;
