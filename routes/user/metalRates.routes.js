const express = require("express");
const router = express.Router();

const { getMetalRates } = require("../../controllers/user/metalRates.controller");

router.get("/", getMetalRates);

module.exports = router;