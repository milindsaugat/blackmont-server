const mongoose = require("mongoose");

const adminOtpSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    newEmail: { type: String },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AdminOtp", adminOtpSchema);