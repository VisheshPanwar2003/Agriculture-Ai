const express = require("express");
const multer = require("multer");

const {
  analyzeVision,
} = require("../controllers/visionController");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

router.post(
  "/analyze",
  upload.single("file"),
  analyzeVision
);

module.exports = router;