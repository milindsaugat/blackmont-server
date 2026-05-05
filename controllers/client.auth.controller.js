const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Client = require("../models/client.model");
const sendMail = require("../utils/sendMail");

const ADMIN_EMAIL = process.env.MAIL_USER;

const sanitizeClient = (client) => {
  const clientObject = client.toObject ? client.toObject() : client;
  delete clientObject.password;
  return clientObject;
};

const buildClientLoginEmailHtml = ({ name, email, ip, timestamp }) => `
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
      <p>Client Login Alert</p>
    </div>
    <div class="body">
      <div class="badge">🔐 Client Login Detected</div>
      <div class="field">
        <div class="field-label">Client Name</div>
        <div class="field-value">${name || "—"}</div>
      </div>
      <div class="field">
        <div class="field-label">Email Address</div>
        <div class="field-value">${email || "—"}</div>
      </div>
      <div class="field">
        <div class="field-label">IP Address</div>
        <div class="field-value">${ip || "Unknown"}</div>
      </div>
      <div class="field">
        <div class="field-label">Login Time</div>
        <div class="field-value">${timestamp}</div>
      </div>
    </div>
    <div class="footer">
      <p>This is an automated login notification from the Blackmont client portal.</p>
    </div>
  </div>
</body>
</html>
`;

const clientLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const client = await Client.findOne({ email }).select("+password");

    if (!client) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (client.status === "suspended" || client.status === "inactive") {
      return res.status(403).json({
        success: false,
        message: "Client account is not active",
      });
    }

    const isMatch = await bcrypt.compare(password, client.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    client.lastLogin = new Date();
    await client.save();

    const token = jwt.sign(
      {
        id: client._id,
        name: client.name,
        email: client.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Send login notification email (non-blocking)
    try {
      const clientIp =
        req.headers["x-forwarded-for"] ||
        req.connection?.remoteAddress ||
        req.ip ||
        "Unknown";

      await sendMail({
        to: ADMIN_EMAIL,
        subject: `Client Login: ${client.name} (${client.email})`,
        html: buildClientLoginEmailHtml({
          name: client.name,
          email: client.email,
          ip: clientIp,
          timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
        }),
      });
    } catch (mailErr) {
      console.error("⚠️ Client login successful but email notification failed:", mailErr.message);
    }

    res.status(200).json({
      success: true,
      message: "Client login successful",
      token,
      client: sanitizeClient(client),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Client login failed",
      error: error.message,
    });
  }
};

const getClientProfile = async (req, res) => {
  try {
    const client = await Client.findById(req.client.id);

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    res.status(200).json({
      success: true,
      client: sanitizeClient(client),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch client profile",
      error: error.message,
    });
  }
};

module.exports = {
  clientLogin,
  getClientProfile,
};
