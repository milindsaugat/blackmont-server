const bcrypt = require("bcrypt");
const Admin = require("../../models/admin.model");
const AdminOtp = require("../../models/adminOtp.model");
const sendMail = require("../../utils/sendMail");

const sendEmailChangeOtp = async (req, res) => {
  try {
    const { currentEmail, newEmail } = req.body;

    if (!currentEmail || !newEmail) {
      return res.status(400).json({
        success: false,
        message: "Current email and new email are required",
      });
    }

    const currentEmailLower = currentEmail.toLowerCase();
    const newEmailLower = newEmail.toLowerCase();
    const admin = await Admin.findById(req.admin.id);

    if (!admin || admin.email.toLowerCase() !== currentEmailLower) {
      return res.status(404).json({
        success: false,
        message: "Current admin email not found",
      });
    }

    const existingNewEmail = await Admin.findOne({ email: newEmailLower });

    if (existingNewEmail && existingNewEmail._id.toString() !== admin._id.toString()) {
      return res.status(409).json({
        success: false,
        message: "This new email is already in use",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await AdminOtp.deleteMany({ email: currentEmailLower });

    await AdminOtp.create({
      email: currentEmailLower,
      newEmail: newEmailLower,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    await sendMail({
      to: currentEmailLower,
      subject: "Blackmont Admin Email Change OTP",
      html: `
        <h2>Blackmont Admin Verification</h2>
        <p>Your OTP for changing admin email is:</p>
        <h1>${otp}</h1>
        <p>This OTP will expire in 5 minutes.</p>
      `,
    });

    // Only return OTP in development, not in production
    const response = {
      success: true,
      message: "OTP sent to current admin email",
    };

    if (process.env.NODE_ENV !== "production") {
      response.otp = otp;
    }

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to send OTP",
      error: error.message,
    });
  }
};

const verifyEmailOtpAndUpdate = async (req, res) => {
  try {
    const { currentEmail, newEmail, otp } = req.body;

    if (!currentEmail || !newEmail || !otp) {
      return res.status(400).json({
        success: false,
        message: "Current email, new email, and OTP are required",
      });
    }

    const currentEmailLower = currentEmail.toLowerCase();
    const newEmailLower = newEmail.toLowerCase();

    const otpRecord = await AdminOtp.findOne({
      email: currentEmailLower,
      newEmail: newEmailLower,
      otp,
    });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (otpRecord.expiresAt < new Date()) {
      await AdminOtp.deleteOne({ _id: otpRecord._id });

      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    const admin = await Admin.findById(req.admin.id);

    if (!admin || admin.email.toLowerCase() !== currentEmailLower) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    admin.email = newEmailLower;
    await admin.save();

    await AdminOtp.deleteMany({ email: currentEmailLower });

    res.status(200).json({
      success: true,
      message: "Admin email updated successfully",
      email: admin.email,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update email",
      error: error.message,
    });
  }
};

const updateAdminPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All password fields are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match",
      });
    }

    const admin = await Admin.findById(req.admin.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, admin.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    await admin.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update password",
      error: error.message,
    });
  }
};


module.exports = {
  sendEmailChangeOtp,
  verifyEmailOtpAndUpdate,
  updateAdminPassword,
};
