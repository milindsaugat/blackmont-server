const express = require("express");
const router = express.Router();

const adminAuth = require("../../middlewares/adminAuth.middleware");
const upload = require("../../middlewares/uploadInvestorReportFile.middleware");

const {
  getInvestorReportsAdmin,
  getSingleInvestorReportAdmin,
  createInvestorReport,
  updateInvestorReport,
  deleteInvestorReport,
  toggleInvestorReportPublished,
} = require("../../controllers/admin/investorReport.admin.controller");

router.get("/reports", adminAuth, getInvestorReportsAdmin);
router.get("/reports/:id", adminAuth, getSingleInvestorReportAdmin);
router.post("/reports", adminAuth, upload.single("reportFile"), createInvestorReport);
router.patch(
  "/reports/:id",
  adminAuth,
  upload.single("reportFile"),
  updateInvestorReport
);
router.delete("/reports/:id", adminAuth, deleteInvestorReport);
router.patch("/reports/:id/published", adminAuth, toggleInvestorReportPublished);

module.exports = router;
