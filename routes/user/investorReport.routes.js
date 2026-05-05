const express = require("express");
const router = express.Router();

const {
  getInvestorReports,
  getSingleInvestorReport,
} = require("../../controllers/investorReport.controller");

router.get("/reports", getInvestorReports);
router.get("/reports/:id", getSingleInvestorReport);

module.exports = router;
