const express = require("express");
const router = express.Router();

const { getPublicLeadership } = require("../../controllers/leadership.controller");

router.get("/leadership", getPublicLeadership);

module.exports = router;
