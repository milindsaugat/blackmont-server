const express = require("express");
const router = express.Router();

const {
  getPublicAboutBlackmont,
} = require("../../controllers/aboutBlackmont.controller");

router.get("/about-blackmont", getPublicAboutBlackmont);

module.exports = router;
