const express = require("express");
const router = express.Router();

const verifyAdminToken = require("../../middlewares/adminAuth.middleware");
const {
  getWhoWeServeAdmin,
  upsertWhoWeServe,
} = require("../../controllers/admin/whoWeServe.admin.controller");

router.get("/", verifyAdminToken, getWhoWeServeAdmin);
router.patch("/", verifyAdminToken, upsertWhoWeServe);

module.exports = router;
