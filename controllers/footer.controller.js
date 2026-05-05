const Footer = require("../models/footer.model");

const DEFAULT_FOOTER = {
  socialLinks: {
    linkedin: "",
    twitter: "",
    instagram: "",
    facebook: "",
    youtube: "",
  },
  isActive: true,
};

const getFooter = async (req, res) => {
  try {
    const footer = await Footer.findOne({ isActive: true });

    // If no footer exists, return default with empty social links
    if (!footer) {
      return res.status(200).json({
        success: true,
        message: "Footer settings retrieved successfully",
        footer: DEFAULT_FOOTER,
      });
    }

    res.status(200).json({
      success: true,
      message: "Footer settings retrieved successfully",
      footer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch footer settings",
      error: error.message,
    });
  }
};

module.exports = {
  getFooter,
};
