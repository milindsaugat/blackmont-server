const express = require("express");
const router = express.Router();

const adminAuth = require("../../middlewares/adminAuth.middleware");
const {
  getAdminMissionVision,
  updateMissionVision,
} = require("../../controllers/admin/missionVision.admin.controller");

router.get("/mission-vision", adminAuth, getAdminMissionVision);
router.patch("/mission-vision", adminAuth, updateMissionVision);

module.exports = router;
