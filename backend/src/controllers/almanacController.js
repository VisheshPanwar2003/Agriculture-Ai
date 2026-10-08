const FarmersAlmanac =
  require("../services/almanacService");

const almanac =
  new FarmersAlmanac();
const { normalizeResponseLanguage } = require("../utils/responseLanguage");

exports.getDailyAlmanac = (
  req,
  res
) => {
  res.json(
    almanac.getDailyAlmanac()
  );
};

exports.getSeasonalGuide = (
  req,
  res
) => {
  const { region } = req.params;

  res.json(
    almanac.getSeasonalGuide(
      region
    )
  );
};

exports.getCropAIData = async (
  req,
  res
) => {
  const { crop_name } =
    req.params;

  const cropData = await almanac.getCropAIData(
    crop_name,
    normalizeResponseLanguage(req.query.language)
  );

  res.json(cropData);
};
