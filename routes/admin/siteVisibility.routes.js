const express = require("express");
const router = express.Router();

const adminAuth = require("../../middlewares/adminAuth.middleware");
const {
  getSiteVisibility,
  updateSiteVisibility,
} = require("../../controllers/admin/siteVisibility.admin.controller");

router.get("/", adminAuth, getSiteVisibility);
router.patch("/", adminAuth, updateSiteVisibility);

module.exports = router;
