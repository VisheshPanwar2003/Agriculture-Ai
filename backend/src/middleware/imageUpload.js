const multer = require("multer");

const allowedTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 1,
  },
  fileFilter(req, file, callback) {
    if (!allowedTypes.has(file.mimetype)) {
      const error = new Error("Only JPG, PNG, and WEBP images are supported.");
      error.statusCode = 415;
      return callback(error);
    }

    callback(null, true);
  },
});

module.exports = upload.single("file");
