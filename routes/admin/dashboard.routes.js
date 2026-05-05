const express = require("express");
const router = express.Router();

const adminAuth = require("../../middlewares/adminAuth.middleware");
const {
  getDashboardOverview,
} = require("../../controllers/admin/dashboard.admin.controller");

router.get("/overview", adminAuth, getDashboardOverview);

module.exports = router;