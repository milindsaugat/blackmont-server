const express = require("express");
const router = express.Router();

const {
  getInvestorStockInfo,
} = require("../../controllers/investorStockInfo.controller");

router.get("/stock-information", getInvestorStockInfo);

module.exports = router;
