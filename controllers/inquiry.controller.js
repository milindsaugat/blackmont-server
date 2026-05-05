const Inquiry = require("../models/inquiry.model");
const sendMail = require("../utils/sendMail");

const ADMIN_EMAIL = process.env.MAIL_USER;

const buildInquiryEmailHtml = ({ name, email, phone, company, subject, message }) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    body { margin: 0; padding: 0; background: #0a0a0a; font-family: 'Segoe UI', Arial, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; background: #111; border: 1px solid #222; border-radius: 16px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #1a1a1a 0%, #111 100%); padding: 32px 28px; border-bottom: 1px solid #D4AF37; text-align: center; }
    .header h1 { color: #D4AF37; font-size: 20px; margin: 0 0 4px; letter-spacing: 2px; }
    .header p { color: #999; font-size: 12px; margin: 0; letter-spacing: 1px; text-transform: uppercase; }
    .body { padding: 28px; }
    .badge { display: inline-block; background: rgba(212,175,55,0.12); color: #D4AF37; padding: 6px 14px; border-radius: 20px; font-size: 11px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 20px; border: 1px solid rgba(212,175,55,0.2); }
    .field { margin-bottom: 18px; }
    .field-label { color: #D4AF37; font-size: 10px; text-transform: uppercase; letter-spacing: 1.8px; font-weight: 600; margin-bottom: 6px; }
    .field-value { color: #e0e0e0; font-size: 15px; line-height: 1.6; padding: 12px 16px; background: #0a0a0a; border: 1px solid #222; border-radius: 10px; word-break: break-word; }
    .footer { padding: 20px 28px; border-top: 1px solid #222; text-align: center; }
    .footer p { color: #555; font-size: 11px; margin: 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>BLACKMONT</h1>
      <p>Contact Form Inquiry</p>
    </div>
    <div class="body">
      <div class="badge">📩 New Contact Inquiry</div>
      <div class="field">
        <div class="field-label">Full Name</div>
        <div class="field-value">${name || "—"}</div>
      </div>
      <div class="field">
        <div class="field-label">Email Address</div>
        <div class="field-value">${email || "—"}</div>
      </div>
      <div class="field">
        <div class="field-label">Phone Number</div>
        <div class="field-value">${phone || "Not provided"}</div>
      </div>
      <div class="field">
        <div class="field-label">Company</div>
        <div class="field-value">${company || "Not provided"}</div>
      </div>
      <div class="field">
        <div class="field-label">Subject</div>
        <div class="field-value">${subject || "General Inquiry"}</div>
      </div>
      <div class="field">
        <div class="field-label">Message</div>
        <div class="field-value">${message || "—"}</div>
      </div>
    </div>
    <div class="footer">
      <p>This email was sent automatically from the Blackmont website contact form.</p>
    </div>
  </div>
</body>
</html>
`;

const createInquiry = async (req, res) => {
  try {
    const { name, email, phone, company, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email and message are required",
      });
    }

    const inquiry = await Inquiry.create({
      name,
      email,
      phone,
      company,
      subject,
      message,
    });

    // Send email notification (non-blocking — don't fail the API if email fails)
    try {
      await sendMail({
        to: ADMIN_EMAIL,
        subject: `New Contact Inquiry from ${name}`,
        html: buildInquiryEmailHtml({ name, email, phone, company, subject, message }),
      });
    } catch (mailErr) {
      console.error("⚠️ Inquiry saved but email notification failed:", mailErr.message);
    }

    res.status(201).json({
      success: true,
      message: "Inquiry submitted successfully",
      inquiry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to submit inquiry",
      error: error.message,
    });
  }
};

module.exports = {
  createInquiry,
};