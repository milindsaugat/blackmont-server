const express = require("express");
const router = express.Router();

const adminAuthMiddleware = require("../../middlewares/adminAuth.middleware");

const {
  getWhyBlackmontAdmin,
  upsertWhyBlackmont,
  addFeatureColumn,
  updateFeatureColumn,
  deleteFeatureColumn,
} = require("../../controllers/admin/whyBlackmont.admin.controller");

router.get("/why-blackmont", adminAuthMiddleware, getWhyBlackmontAdmin);
router.patch("/why-blackmont", adminAuthMiddleware, upsertWhyBlackmont);
router.post("/why-blackmont/columns", adminAuthMiddleware, addFeatureColumn);
router.patch(
  "/why-blackmont/columns/:columnId",
  adminAuthMiddleware,
  updateFeatureColumn
);
router.delete(
  "/why-blackmont/columns/:columnId",
  adminAuthMiddleware,
  deleteFeatureColumn
);

module.exports = router;
