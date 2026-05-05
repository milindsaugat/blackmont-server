const express = require("express");
const router = express.Router();

const {
  getPublicMissionVision,
} = require("../../controllers/missionVision.controller");

router.get("/mission-vision", getPublicMissionVision);

module.exports = router;
