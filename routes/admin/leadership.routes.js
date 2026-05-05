const express = require("express");
const router = express.Router();

const adminAuth = require("../../middlewares/adminAuth.middleware");
const {
  getAdminLeadership,
  updateLeadership,
} = require("../../controllers/admin/leadership.admin.controller");

router.get("/leadership", adminAuth, getAdminLeadership);
router.patch("/leadership", adminAuth, updateLeadership);

module.exports = router;
