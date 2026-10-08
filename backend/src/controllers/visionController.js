const {
  analyzeCropImage,
} = require("../services/cropAnalysisService");

exports.analyzeVision =
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          error: "An image file is required.",
        });
      }

      const result =
        await analyzeCropImage(
          req.file,
          "crop",
          req.body.question
        );

      if (result.status === "Analysis Failed") {
        return res.status(502).json({
          error: result.issues,
        });
      }

      res.json(result);

    } catch {

      res.status(500).json({
        error: "Unable to analyze this image.",
      });
    }
  };
