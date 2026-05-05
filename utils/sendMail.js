const nodemailer = require("nodemailer");

// Check for required email environment variables
if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
  console.error(
    "❌ EMAIL CONFIG ERROR: MAIL_USER or MAIL_PASS is not set in environment variables"
  );
  console.error("   MAIL_USER:", process.env.MAIL_USER ? "✓ Set" : "✗ Missing");
  console.error("   MAIL_PASS:", process.env.MAIL_PASS ? "✓ Set" : "✗ Missing");
  console.error("   Note: MAIL_PASS must be Gmail App Password, not normal Gmail password");
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// Verify transporter connection
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email transporter verification failed:", error.message);
    console.error("   Please check MAIL_USER and MAIL_PASS in environment variables");
    console.error("   MAIL_PASS must be Gmail App Password (not regular Gmail password)");
  } else {
    console.log("✅ Email transporter verified and ready to send emails");
  }
});

const sendMail = async ({ to, subject, html }) => {
  try {
    const result = await transporter.sendMail({
      from: `"Blackmont Admin" <${process.env.MAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`✅ Email sent successfully to ${to}`);
    return result;
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}:`, error.message);
    throw error;
  }
};

module.exports = sendMail;