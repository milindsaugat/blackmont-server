const express = require("express");
const router = express.Router();

const adminAuthMiddleware = require("../../middlewares/adminAuth.middleware");

const {
  getAdminHomeMarket,
  updateHomeMarket,
  addHomeMarketTag,
  deleteHomeMarketTag,
  addChartDataPoint,
  deleteChartDataPoint,
} = require("../../controllers/admin/homeMarket.admin.controller");

router.get("/", adminAuthMiddleware, getAdminHomeMarket);
router.patch("/", adminAuthMiddleware, updateHomeMarket);
router.post("/tags", adminAuthMiddleware, addHomeMarketTag);
router.delete("/tags/:tag", adminAuthMiddleware, deleteHomeMarketTag);
router.post("/chart-data", adminAuthMiddleware, addChartDataPoint);
router.delete(
  "/chart-data/:dataId",
  adminAuthMiddleware,
  deleteChartDataPoint
);

module.exports = router;
