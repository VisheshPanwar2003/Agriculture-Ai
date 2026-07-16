const FarmersAlmanac =
  require("../services/almanacService");

const almanac =
  new FarmersAlmanac();

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

exports.getCropAIData = (
  req,
  res
) => {
  const { crop_name } =
    req.params;

  res.json(
    almanac.getCropAIData(
      crop_name
    )
  );
};