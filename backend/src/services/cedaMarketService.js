const axios = require("axios");

const BASE_URL = "https://agmarknet.ceda.ashoka.edu.in/api";
const REQUEST_TIMEOUT_MS = 15000;
const cache = new Map();
const CACHE_TTL_MS = 60 * 60 * 1000;

function rowsFrom(payload) {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];
  for (const key of ["data", "records", "results", "states", "commodities", "geographies", "districts"]) {
    if (Array.isArray(payload[key])) return payload[key];
  }
  return [];
}

function valueFrom(row, names) {
  for (const name of names) {
    if (row?.[name] !== undefined && row[name] !== null) return row[name];
  }
  return undefined;
}

function normalizeText(value) {
  return String(value || "").trim().toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
}

function findByName(rows, name, nameFields, idFields) {
  const expected = normalizeText(name);
  const found = rows.find((row) => normalizeText(valueFrom(row, nameFields)) === expected);
  return found ? valueFrom(found, idFields) : null;
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

async function getJson(path, params, deadlineAt) {
  const { data } = await axios.get(BASE_URL + path, {
    params,
    timeout: requestTimeout(deadlineAt),
    headers: {
      Accept: "application/json",
      Origin: "https://agmarknet.ceda.ashoka.edu.in",
      Referer: "https://agmarknet.ceda.ashoka.edu.in/",
    },
  });
  return data;
}

function parseDate(value) {
  if (!value) return null;
  const asIso = new Date(value);
  if (!Number.isNaN(asIso.getTime())) return asIso;
  const match = String(value).match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  return match ? new Date(match[3] + "-" + match[2].padStart(2, "0") + "-" + match[1].padStart(2, "0") + "T12:00:00Z") : null;
}

function toRecord(row, state, commodity) {
  const arrivalDate = valueFrom(row, ["arrival_date", "date", "t", "reported_date", "price_date"]);
  return {
    state: valueFrom(row, ["state", "state_name"]) || state,
    district: valueFrom(row, ["district", "district_name"]) || "",
    market: valueFrom(row, ["market", "market_name", "mandi", "centre", "center"]) || "",
    commodity: valueFrom(row, ["commodity", "commodity_name", "cmdty"]) || commodity,
    variety: valueFrom(row, ["variety"]) || "",
    grade: valueFrom(row, ["grade"]) || "",
    arrival_date: arrivalDate ? String(arrivalDate).slice(0, 10) : "",
    min_price: valueFrom(row, ["min_price", "p_min", "min"]),
    max_price: valueFrom(row, ["max_price", "p_max", "max"]),
    modal_price: valueFrom(row, ["modal_price", "p_modal", "modal"]),
  };
}

async function getPrices({ state, commodity, district, market, offset, limit, deadlineAt = Date.now() + 45000 }) {
  const key = JSON.stringify({ state, commodity, district, market, offset, limit });
  const cached = cache.get(key);
  if (cached && cached.expiresAt > Date.now()) return cached.value;

  const [statesPayload, commoditiesPayload] = await Promise.all([
    getJson("/states", undefined, deadlineAt),
    getJson("/commodities", undefined, deadlineAt),
  ]);
  const states = rowsFrom(statesPayload);
  const commodities = rowsFrom(commoditiesPayload);
  const stateNames = ["state", "name", "state_name", "census_state_name", "label"];
  const stateIds = ["state_id", "census_state_id", "id", "geo_id", "geography_id", "value"];
  const commodityNames = ["commodity", "name", "commodity_name", "commodity_disp_name", "display_name", "label"];
  const commodityIds = ["commodity_id", "id", "value"];
  const stateId = findByName(states, state, stateNames, stateIds)
    ?? (normalizeText(state) === "delhi"
      ? findByName(states, "NCT of Delhi", stateNames, stateIds)
      : null);
  const commodityId = findByName(commodities, commodity, commodityNames, commodityIds);

  if (stateId === null || commodityId === null) {
    const error = new Error(stateId === null ? "State is not available from the CEDA source." : "Commodity is not available from the CEDA source.");
    error.code = "CEDA_FILTER_NOT_FOUND";
    throw error;
  }

  let districtId = 0;
  if (district) {
    const districtRows = rowsFrom(await getJson("/districts", { state_id: stateId }, deadlineAt));
    districtId = findByName(districtRows, district, ["district", "name", "district_name", "label"], ["district_id", "id", "geo_id", "value"]);
    if (districtId === null) {
      const error = new Error("District is not available from the CEDA source.");
      error.code = "CEDA_FILTER_NOT_FOUND";
      throw error;
    }
  }

  const endDate = new Date();
  const startDate = new Date(endDate);
  startDate.setUTCFullYear(startDate.getUTCFullYear() - 2);
  const { data: rawData } = await axios.post(BASE_URL + "/prices", {
    state_id: stateId,
    commodity_id: commodityId,
    district_id: districtId,
    calculation_type: "d",
    chart_type: "datadownload",
    start_date: startDate.toISOString(),
    end_date: endDate.toISOString(),
  }, {
    timeout: requestTimeout(deadlineAt),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Origin: "https://agmarknet.ceda.ashoka.edu.in",
      Referer: "https://agmarknet.ceda.ashoka.edu.in/",
    },
  });

  const records = rowsFrom(rawData)
    .map((row) => toRecord(row, state, commodity))
    .filter((row) => !market || normalizeText(row.market).includes(normalizeText(market)))
    .sort((a, b) => (parseDate(b.arrival_date)?.getTime() || 0) - (parseDate(a.arrival_date)?.getTime() || 0));

  const page = records.slice(offset, offset + limit);
  const result = {
    records: page,
    total: records.length,
    offset,
    limit,
    fetchedAt: new Date().toISOString(),
    source: "CEDA Agri Market Data (AGMARKNET) — latest available",
    sourceUrl: "https://ceda.ashoka.edu.in/agmarknet/",
    sourceProvider: "ceda",
    sourceCredit: "CEDA Agri Market Data (CEDA-AMD), Centre for Economic Data & Analysis, Ashoka University.",
    freshness: "CEDA data is updated periodically; this is the latest available report, not a live quote.",
  };
  cache.set(key, { value: result, expiresAt: Date.now() + CACHE_TTL_MS });
  return result;
}

module.exports = { getPrices };
