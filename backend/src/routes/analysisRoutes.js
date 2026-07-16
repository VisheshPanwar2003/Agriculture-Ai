const express = require("express");
const multer = require("multer");

const {
  predictCrop,
} = require("../controllers/analysisController");

const router = express.Router();

const upload = multer({
  storage:
    multer.memoryStorage(),
});

router.post(
  "/predict",
  upload.single("file"),
  predictCrop
);

module.exports = router;