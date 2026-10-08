const express = require("express");

const {
  analyzeVision,
} = require("../controllers/visionController");
const authMiddleware = require("../middleware/authMiddleware");
const imageUpload = require("../middleware/imageUpload");

const router = express.Router();

router.post(
  "/analyze",
  authMiddleware,
  imageUpload,
  analyzeVision
);

module.exports = router;
