const express = require("express");
const router = express.Router();

const { getInvestorOverview } = require("../../controllers/investorOverview.controller");

router.get("/overview", getInvestorOverview);

module.exports = router;
