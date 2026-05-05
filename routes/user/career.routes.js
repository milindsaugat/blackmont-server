const express = require("express");
const router = express.Router();

const {
  getCareers,
  getCareerJobBySlug,
} = require("../../controllers/career.controller");

router.get("/careers", getCareers);
router.get("/careers/jobs/:slug", getCareerJobBySlug);

module.exports = router;
