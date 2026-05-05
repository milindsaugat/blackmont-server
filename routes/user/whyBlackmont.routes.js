const express = require("express");
const router = express.Router();

const { getWhyBlackmont } = require("../../controllers/whyBlackmont.controller");

router.get("/why-blackmont", getWhyBlackmont);

module.exports = router;
