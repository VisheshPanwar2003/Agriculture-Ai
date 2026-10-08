const express = require("express");

const {
  predictCrop,
} = require("../controllers/analysisController");
const authMiddleware = require("../middleware/authMiddleware");
const imageUpload = require("../middleware/imageUpload");

const router = express.Router();

router.post(
  "/predict",
  authMiddleware,
  imageUpload,
  predictCrop
);

module.exports = router;
