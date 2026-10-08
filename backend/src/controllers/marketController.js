const marketPriceService = require("../services/marketPriceService");

const clean = (value) => (typeof value === "string" ? value.trim() : "");

exports.getMarketPrices = async (req, res) => {
  console.info("[marketController] GET /market/prices received");
  const state = clean(req.query.state);
  const commodity = clean(req.query.commodity);
  const district = clean(req.query.district);
  const market = clean(req.query.market);

  if (!state || !commodity) {
    return res.status(400).json({ error: "State and commodity are required." });
  }
  if ([state, commodity, district, market].some((value) => value.length > 80)) {
    return res.status(400).json({ error: "Search values must be 80 characters or fewer." });
  }

  const offsetValue = Number.parseInt(req.query.offset, 10);
  const limitValue = Number.parseInt(req.query.limit, 10);
  const offset = Number.isFinite(offsetValue) ? Math.max(0, Math.min(offsetValue, 10000)) : 0;
  // data.gov.in's shared test key is limited to 10 records per request.
  const limit = Number.isFinite(limitValue) ? Math.max(1, Math.min(limitValue, 10)) : 10;

  try {
    return res.json(await marketPriceService.getPrices({ state, commodity, district, market, offset, limit }));
  } catch (error) {
    if (error.code === "CEDA_FILTER_NOT_FOUND" || error.code === "AGMARKNET_FILTER_NOT_FOUND") {
      return res.status(422).json({
        error: "That state, district, or commodity is not available in the market data source. Check the spelling or remove the district filter.",
      });
    }
    if (error.code === "MARKET_API_KEY_MISSING") {
      return res.status(503).json({ error: "Mandi lookup is not configured on the server yet." });
    }
    return res.status(502).json({
      error: "Mandi prices are temporarily unavailable. Please try again later.",
      ...(error.diagnostics ? { diagnostics: error.diagnostics } : {}),
    });
  }
};
