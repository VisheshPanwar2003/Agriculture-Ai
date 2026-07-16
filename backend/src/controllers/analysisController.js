const {
  analyzeCropImage,
} = require("../services/cropAnalysisService");

exports.predictCrop =
  async (req, res) => {
    try {
      const result =
        await analyzeCropImage(
          req.file
        );

      res.json(result);

    } catch (error) {

      res.status(500).json({
        error: error.message,
      });
    }
  };