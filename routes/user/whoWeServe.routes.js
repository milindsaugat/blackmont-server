const express = require("express");
const router = express.Router();

const { getWhoWeServe } = require("../../controllers/user/whoWeServe.controller");

router.get("/", getWhoWeServe);

module.exports = router;
