const express = require("express");
const {
  getPublicHomeHero,
} = require("../../controllers/user/homeHero.controller");

const router = express.Router();

router.get("/", getPublicHomeHero);

module.exports = router;
