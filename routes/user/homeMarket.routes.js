const express = require("express");
const router = express.Router();

const { getPublicHomeMarket } = require("../../controllers/homeMarket.controller");

router.get("/", getPublicHomeMarket);

module.exports = router;
