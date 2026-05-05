const express = require("express");
const router = express.Router();

const {
  getApiSettings,
  updateApiSettings,
} = require("../../controllers/admin/apiSettings.controller");

const verifyAdminToken = require("../../middlewares/adminAuth.middleware");

router.get("/", verifyAdminToken, getApiSettings);
router.patch("/", verifyAdminToken, updateApiSettings);

module.exports = router;