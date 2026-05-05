const Admin = require("../../models/admin.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AdminOtp = require("../../models/adminOtp.model");
const sendMail = require("../../utils/sendMail");

const cleanupDuplicateAdmins = async () => {
  const admins = await Admin.find().sort({ updatedAt: -1, createdAt: -1 });

  if (admins.length <= 1) return admins[0] || null;

  const keepAdmin = admins[0];
  const deleteIds = admins.slice(1).map((admin) => admin._id);

  await Admin.deleteMany({ _id: { $in: deleteIds } });

  return keepAdmin;
};

const createToken = (admin) => {
  return jwt.sign(
    {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const emailLower = email.toLowerCase();

    let primaryAdmin = await cleanupDuplicateAdmins();

    if (!primaryAdmin) {
      const hashedPassword = await bcrypt.hash(password, 10);

      primaryAdmin = await Admin.create({
        name: "Blackmont Admin",
        email: emailLower,
        password: hashedPassword,
        role: "super_admin",
      });
    }

    if (primaryAdmin.email.toLowerCase() !== emailLower) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    const isMatch = await bcrypt.compare(password, primaryAdmin.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = createToken(primaryAdmin);

    res.status(200).json({
      success: true,
      message: "Admin login successful",
      token,
      admin: {
        id: primaryAdmin._id,
        name: primaryAdmin.name,
        email: primaryAdmin.email,
        role: primaryAdmin.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Admin login failed",
      error: error.message,
    });
  }
};

const sendForgotPasswordOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Admin email is required",
      });
    }

    const admin = await cleanupDuplicateAdmins();
    const emailLower = email.toLowerCase();

    if (!admin || admin.email.toLowerCase() !== emailLower) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await AdminOtp.deleteMany({ email: emailLower });

    await AdminOtp.create({
      email: emailLower,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    await sendMail({
      to: emailLower,
      subject: "Blackmont Admin Password Reset OTP",
      html: `
        <h2>Blackmont Admin Password Reset</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP will expire in 5 minutes.</p>
      `,
    });

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      otp,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to send OTP",
      error: error.message,
    });
  }
};

const verifyForgotPasswordOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const emailLower = email.toLowerCase();

    const otpRecord = await AdminOtp.findOne({ email: emailLower, otp });

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

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to verify OTP",
      error: error.message,
    });
  }
};

const resetAdminPassword = async (req, res) => {
  try {
    const { email, otp, newPassword, confirmPassword } = req.body;

    if (!email || !otp || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match",
      });
    }

    const admin = await cleanupDuplicateAdmins();
    const emailLower = email.toLowerCase();

    if (!admin || admin.email.toLowerCase() !== emailLower) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    const otpRecord = await AdminOtp.findOne({ email: emailLower, otp });

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

    admin.password = await bcrypt.hash(newPassword, 10);
    await admin.save();

    await AdminOtp.deleteMany({ email: emailLower });

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to reset password",
      error: error.message,
    });
  }
};

module.exports = {
  adminLogin,
  sendForgotPasswordOtp,
  verifyForgotPasswordOtp,
  resetAdminPassword,
};