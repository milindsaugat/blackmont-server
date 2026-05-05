const express = require("express");
const router = express.Router();

const { getPublicServiceCards } = require("../../controllers/serviceCard.controller");

router.get("/", getPublicServiceCards);

module.exports = router;
