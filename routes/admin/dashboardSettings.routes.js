const express = require("express");
const router = express.Router();

const verifyAdminToken = require("../../middlewares/adminAuth.middleware");
const {
  getDashboardSettings,
  updateDashboardSettings,
} = require("../../controllers/admin/dashboardSettings.admin.controller");

router.get("/", verifyAdminToken, getDashboardSettings);
router.patch("/", verifyAdminToken, updateDashboardSettings);

module.exports = router;
