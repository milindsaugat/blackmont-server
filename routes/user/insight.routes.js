const express = require("express");
const router = express.Router();

const {
  getPublishedInsights,
  getFeaturedInsights,
  getInsightBySlug,
  getInsightHeader,
} = require("../../controllers/insight.controller");

// GET insight header
router.get("/header", getInsightHeader);

// GET all published insights
router.get("/", getPublishedInsights);

// GET featured insights
router.get("/featured", getFeaturedInsights);

// GET single insight by slug
router.get("/:slug", getInsightBySlug);

module.exports = router;
