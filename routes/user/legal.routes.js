const express = require("express");
const router = express.Router();

const {
  getPublicLegalSectionByType,
  getPublicAllLegalSections,
} = require("../../controllers/legal.controller");

router.get("/", getPublicAllLegalSections);
router.get("/:type", getPublicLegalSectionByType);

module.exports = router;
