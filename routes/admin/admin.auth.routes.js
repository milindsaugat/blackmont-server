const express = require("express");
const router = express.Router();

const {
  adminLogin,
  sendForgotPasswordOtp,
  verifyForgotPasswordOtp,
  resetAdminPassword,
} = require("../../controllers/admin/admin.auth.controller");

const adminAuth = require("../../middlewares/adminAuth.middleware");

router.post("/login", adminLogin);

router.post("/forgot-password/send-otp", sendForgotPasswordOtp);
router.post("/forgot-password/verify-otp", verifyForgotPasswordOtp);
router.patch("/forgot-password/reset-password", resetAdminPassword);

router.get("/profile", adminAuth, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Admin profile fetched successfully",
    admin: req.admin,
  });
});

module.exports = router;