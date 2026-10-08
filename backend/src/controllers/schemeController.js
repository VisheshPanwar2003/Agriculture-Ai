const schemes = require("../data/schemes");

exports.getSchemes = (req, res) => {
  const query = String(req.query.search || "").trim().toLowerCase();
  const category = String(req.query.category || "").trim().toLowerCase();
  const results = schemes.filter((scheme) => {
    const matchesSearch = !query || `${scheme.name} ${scheme.summary} ${scheme.category}`.toLowerCase().includes(query);
    const matchesCategory = !category || scheme.category.toLowerCase() === category;
    return matchesSearch && matchesCategory;
  });
  res.json({
    schemes: results,
    lastReviewed: "2026-10-08",
    source: "myScheme, Government of India",
    note: "This directory is for discovery only. Eligibility and benefits are determined by the official scheme rules and authorities.",
  });
};
