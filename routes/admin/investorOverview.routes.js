const express = require("express");
const router = express.Router();

const adminAuth = require("../../middlewares/adminAuth.middleware");
const upload = require("../../middlewares/uploadInvestorOverviewFile.middleware");

const {
  getInvestorOverviewAdmin,
  addFrameworkCard,
  updateFrameworkCard,
  deleteFrameworkCard,
} = require("../../controllers/admin/investorOverview.admin.controller");

router.get("/overview", adminAuth, getInvestorOverviewAdmin);
router.post(
  "/overview/cards",
  adminAuth,
  upload.single("cardFile"),
  addFrameworkCard
);
router.patch(
  "/overview/cards/:cardId",
  adminAuth,
  upload.single("cardFile"),
  updateFrameworkCard
);
router.delete("/overview/cards/:cardId", adminAuth, deleteFrameworkCard);

module.exports = router;
