const express = require("express");
const router = express.Router();

const verifyAdminToken = require("../../middlewares/adminAuth.middleware");

const {
  sendEmailChangeOtp,
  verifyEmailOtpAndUpdate,
  updateAdminPassword,
} = require("../../controllers/admin/admin.settings.controller");

router.post("/send-email-otp", verifyAdminToken, sendEmailChangeOtp);
router.patch("/verify-email-otp", verifyAdminToken, verifyEmailOtpAndUpdate);
router.patch("/update-password", verifyAdminToken, updateAdminPassword);

module.exports = router;