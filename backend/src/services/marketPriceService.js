const axios = require("axios");
const cedaMarketService = require("./cedaMarketService");
const agmarknetApiService = require("./agmarknetApiService");

const RESOURCE_ID = "9ef84268-d588-465a-a308-a864a43d0070";
const API_URL = `https://api.data.gov.in/resource/${RESOURCE_ID}`;
const cache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000;
const TOTAL_REQUEST_BUDGET_MS = 45000;

function remainingTimeout(deadlineAt, maxTimeout) {
  const remaining = deadlineAt - Date.now();
  if (remaining <= 0) {
    const error = new Error("Market provider time budget exceeded.");
    error.code = "MARKET_DEADLINE_EXCEEDED";
    throw error;
  }
  return Math.min(maxTimeout, remaining);
}

async function getPrices({ state, commodity, district, market, offset, limit }) {
  const deadlineAt = Date.now() + TOTAL_REQUEST_BUDGET_MS;
  const apiKey = process.env.DATA_GOV_API_KEY?.trim();

  const cacheKey = JSON.stringify({ state, commodity, district, market, offset, limit, apiKey: Boolean(apiKey) });
  const cached = cache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) return cached.value;

  let primaryFailure;
  if (apiKey) {
    const params = {
      "api-key": apiKey,
      format: "json",
      offset,
      limit,
      "filters[state.keyword]": state,
      "filters[commodity]": commodity,
    };
    if (district) params["filters[district]"] = district;
    if (market) params["filters[market]"] = market;

    try {
      const { data } = await axios.get(API_URL, {
        params,
        timeout: remainingTimeout(deadlineAt, 12000),
      });
      if (!Array.isArray(data.records)) {
        const error = new Error("Market data provider returned an unexpected response.");
        error.code = "MARKET_BAD_RESPONSE";
        throw error;
      }

      if (data.records.length > 0) {
        const result = {
          records: data.records,
          total: Number(data.total ?? data.count) || data.records.length,
          offset,
          limit,
          fetchedAt: new Date().toISOString(),
          source: "AGMARKNET via data.gov.in",
          sourceUrl: "https://www.data.gov.in/catalog/current-daily-price-various-commodities-various-markets-mandi",
          sourceProvider: "data.gov.in",
          freshness: "Daily reports; latest data may lag market activity.",
        };
        cache.set(cacheKey, { value: result, expiresAt: Date.now() + CACHE_TTL_MS });
        return result;
      }
    } catch (error) {
      primaryFailure = error;
      // Keep provider diagnostics on the server; never log request params or the API key.
      console.error("[marketPriceService] data.gov.in request failed; trying CEDA fallback", {
        status: error.response?.status || null,
        code: error.code || "UNKNOWN",
        message: error.response?.statusText || error.message || "Unknown provider error",
      });
    }
  }

  let agmarknetFailure;
  try {
    const result = await agmarknetApiService.getPrices({ state, commodity, district, market, offset, limit, deadlineAt });
    if (result.records.length > 0) {
      cache.set(cacheKey, { value: result, expiresAt: Date.now() + CACHE_TTL_MS });
      return result;
    }
    agmarknetFailure = Object.assign(new Error("No matching AGMARKNET records in the recent period."), { code: "NO_MATCHING_RECORDS" });
  } catch (error) {
    agmarknetFailure = error;
    console.error("[marketPriceService] AGMARKNET fallback failed; trying CEDA", {
      status: error.response?.status || null,
      code: error.code || "UNKNOWN",
      message: error.response?.statusText || error.message || "Unknown provider error",
    });
  }

  try {
    const result = await cedaMarketService.getPrices({ state, commodity, district, market, offset, limit, deadlineAt });
    cache.set(cacheKey, { value: result, expiresAt: Date.now() + CACHE_TTL_MS });
    return result;
  } catch (error) {
    console.error("[marketPriceService] CEDA fallback failed", {
      status: error.response?.status || null,
      code: error.code || "UNKNOWN",
      message: error.response?.statusText || error.message || "Unknown provider error",
      primaryCode: primaryFailure?.code || null,
      primaryStatus: primaryFailure?.response?.status || null,
    });
    const providerError = new Error("Mandi price providers are temporarily unavailable.");
    providerError.code = "MARKET_PROVIDER_UNAVAILABLE";
    providerError.diagnostics = {
      dataGov: primaryFailure
        ? {
          status: primaryFailure.response?.status || null,
          code: primaryFailure.code || "UNKNOWN",
        }
        : { status: null, code: apiKey ? "NO_MATCHING_RECORDS" : "API_KEY_NOT_CONFIGURED" },
      ceda: {
        status: error.response?.status || null,
        code: error.code || "UNKNOWN",
      },
      agmarknet: {
        status: agmarknetFailure.response?.status || null,
        code: agmarknetFailure.code || "UNKNOWN",
      },
    };
    throw providerError;
  }
}

module.exports = { getPrices };
