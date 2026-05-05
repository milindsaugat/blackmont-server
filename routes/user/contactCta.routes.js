const express = require("express");
const router = express.Router();

const { getContactCta } = require("../../controllers/contactCta.controller");

router.get("/contact-cta", getContactCta);

module.exports = router;
