const express = require("express");
const router = express.Router();
const {
  getInvestorEvents,
  getSingleInvestorEvent
} = require("../../controllers/investorEvent.controller");

router.get("/events", getInvestorEvents);
router.get("/events/:id", getSingleInvestorEvent);

module.exports = router;
