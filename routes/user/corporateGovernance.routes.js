const express = require("express");
const router = express.Router();
const { getGovernance } = require("../../controllers/corporateGovernance.controller");

router.get("/corporate-governance", getGovernance);

module.exports = router;
