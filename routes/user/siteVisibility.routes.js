const express = require("express");
const router = express.Router();

const {
  getPublicSiteVisibility,
} = require("../../controllers/user/siteVisibility.controller");

router.get("/", getPublicSiteVisibility);

module.exports = router;
