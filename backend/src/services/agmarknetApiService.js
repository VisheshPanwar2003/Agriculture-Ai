const axios = require("axios");

const BASE_URL = "https://api.agmarknet.gov.in/v1";
const REQUEST_TIMEOUT_MS = 15000;
const FILTERS_TTL_MS = 6 * 60 * 60 * 1000;
let filtersCache;

function normalizeText(value) {
  return String(value || "").trim().toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
}

function requestTimeout(deadlineAt) {
  const remaining = deadlineAt - Date.now();
  if (remaining <= 0) {
    const error = new Error("Market provider time budget exceeded.");
    error.code = "MARKET_DEADLINE_EXCEEDED";
    throw error;
  }
  return Math.min(REQUEST_TIMEOUT_MS, remaining);
}

async function request(path, params, deadlineAt) {
  const { data } = await axios.get(`${BASE_URL}${path}`, {
    params,
    timeout: requestTimeout(deadlineAt),
    headers: {
      Accept: "application/json, text/plain, */*",
      Origin: "https://agmarknet.gov.in",
      Referer: "https://agmarknet.gov.in/",
      "User-Agent": "Mozilla/5.0 (compatible; AgriSense/1.0)",
    },
  });
  return data;
}

async function getFilters(deadlineAt) {
  if (filtersCache && filtersCache.expiresAt > Date.now()) return filtersCache.data;
  const response = await request("/daily-price-arrival/filters", undefined, deadlineAt);
  if (response?.status !== true || !response.data?.state_data || !response.data?.cmdt_data) {
    const error = new Error("AGMARKNET returned invalid filter data.");
    error.code = "AGMARKNET_BAD_RESPONSE";
    throw error;
  }
  filtersCache = { data: response.data, expiresAt: Date.now() + FILTERS_TTL_MS };
  return response.data;
}

function resolveId(rows, name, nameKey, idKey, aliases = {}) {
  const expected = normalizeText(aliases[normalizeText(name)] || name);
  const match = rows.find((row) => normalizeText(row[nameKey]) === expected);
  return match ? match[idKey] : null;
}

function parseDate(value) {
  const match = String(value || "").match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!match) return null;
  const date = new Date(Date.UTC(Number(match[3]), Number(match[2]) - 1, Number(match[1])));
  return Number.isNaN(date.getTime()) ? null : date;
}

function isoDate(value) {
  return parseDate(value)?.toISOString().slice(0, 10) || "";
}

async function getPrices({ state, commodity, district, market, offset, limit, deadlineAt = Date.now() + 45000 }) {
  const filters = await getFilters(deadlineAt);
  const stateId = resolveId(filters.state_data, state, "state_name", "state_id", {
    delhi: "NCT of Delhi",
  });
  const commodityId = resolveId(filters.cmdt_data, commodity, "cmdt_name", "cmdt_id");
  if (stateId === null || commodityId === null) {
    const error = new Error(stateId === null ? "State is not available in AGMARKNET." : "Commodity is not available in AGMARKNET.");
    error.code = "AGMARKNET_FILTER_NOT_FOUND";
    throw error;
  }

  let permittedMarketNames;
  if (district) {
    const districtId = resolveId(
      filters.district_data.filter((row) => Number(row.state_id) === Number(stateId)),
      district,
      "district_name",
      "id",
    );
    if (districtId === null) {
      const error = new Error("District is not available in AGMARKNET.");
      error.code = "AGMARKNET_FILTER_NOT_FOUND";
      throw error;
    }
    permittedMarketNames = new Set(filters.market_data
      .filter((row) => Number(row.state_id) === Number(stateId) && Number(row.district_id) === Number(districtId))
      .map((row) => normalizeText(row.mkt_name)));
  }

  const records = [];
  const now = new Date();
  // Check recent months until we have enough records for the requested page.
  for (let monthOffset = 0; monthOffset < 6 && records.length < offset + limit; monthOffset += 1) {
    const monthDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - monthOffset, 1));
    const payload = await request("/prices-and-arrivals/date-wise/specific-commodity", {
      year: monthDate.getUTCFullYear(),
      month: monthDate.getUTCMonth() + 1,
      stateId,
      commodityId,
    }, deadlineAt);
    if (payload?.success !== true || !Array.isArray(payload.markets)) continue;

    for (const marketRow of payload.markets) {
      const marketName = marketRow.marketName || "";
      if (permittedMarketNames && !permittedMarketNames.has(normalizeText(marketName))) continue;
      if (market && !normalizeText(marketName).includes(normalizeText(market))) continue;
      for (const dateRow of marketRow.dates || []) {
        for (const price of dateRow.data || []) {
          records.push({
            state,
            district: district || "",
            market: marketName,
            commodity,
            variety: price.variety || "",
            grade: "",
            arrival_date: isoDate(dateRow.arrivalDate),
            min_price: price.minimumPrice,
            max_price: price.maximumPrice,
            modal_price: price.modalPrice,
          });
        }
      }
    }
  }

  records.sort((a, b) => (b.arrival_date || "").localeCompare(a.arrival_date || ""));

  return {
    records: records.slice(offset, offset + limit),
    total: records.length,
    offset,
    limit,
    fetchedAt: new Date().toISOString(),
    source: "AGMARKNET 2.0 (Government of India)",
    sourceUrl: "https://agmarknet.gov.in/",
    sourceProvider: "agmarknet",
    freshness: "Daily market reports; the latest available date may lag market activity.",
  };
}

module.exports = { getPrices };
