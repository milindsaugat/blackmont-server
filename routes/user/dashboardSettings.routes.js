const express = require("express");
const router = express.Router();

const {
  getPublicDashboardSettings,
} = require("../../controllers/user/dashboardSettings.controller");

router.get("/", getPublicDashboardSettings);

module.exports = router;
