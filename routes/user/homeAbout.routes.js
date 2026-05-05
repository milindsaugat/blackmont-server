const express = require("express");
const router = express.Router();

const { getPublicHomeAbout } = require("../../controllers/homeAbout.controller");

router.get("/", getPublicHomeAbout);

module.exports = router;