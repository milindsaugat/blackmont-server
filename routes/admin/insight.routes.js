const express = require("express");
const router = express.Router();

const adminAuth = require("../../middlewares/adminAuth.middleware");
const upload = require("../../middlewares/uploadInsightImage.middleware");

const {
  getAllInsightsAdmin,
  getSingleInsightAdmin,
  createInsight,
  updateInsight,
  deleteInsight,
  toggleFeaturedInsight,
  togglePublishedInsight,
  getInsightHeaderAdmin,
  updateInsightHeader,
} = require("../../controllers/admin/insight.admin.controller");

// GET all insights (admin)
router.get("/", adminAuth, getAllInsightsAdmin);

// GET insight header (admin)
router.get("/header", adminAuth, getInsightHeaderAdmin);

// GET single insight (admin)
router.get("/:id", adminAuth, getSingleInsightAdmin);

// POST create insight with optional image upload
router.post("/", adminAuth, upload.single("thumbnail"), createInsight);

// PATCH update insight header
router.patch("/header", adminAuth, updateInsightHeader);

// PATCH update insight with optional image upload
router.patch("/:id", adminAuth, upload.single("thumbnail"), updateInsight);

// DELETE insight
router.delete("/:id", adminAuth, deleteInsight);

// PATCH toggle featured status
router.patch("/:id/featured", adminAuth, toggleFeaturedInsight);

// PATCH toggle published status
router.patch("/:id/published", adminAuth, togglePublishedInsight);

module.exports = router;
