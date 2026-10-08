const {
  analyzeCropImage,
} = require("../services/cropAnalysisService");
const { normalizeResponseLanguage } = require("../utils/responseLanguage");

exports.predictCrop =
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
          req.body.analysisType,
          "",
          normalizeResponseLanguage(req.body.language)
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
