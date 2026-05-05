const Footer = require("../../models/footer.model");

const DEFAULT_FOOTER = {
  socialLinks: {
    linkedin: "https://linkedin.com/company/blackmont-capital",
    twitter: "https://twitter.com/blackmont",
    instagram: "https://instagram.com/blackmontcapital",
    facebook: "https://facebook.com/blackmontcapital",
    youtube: "https://youtube.com/@blackmontcapital",
  },
  isActive: true,
};

const getFooter = async (req, res) => {
  try {
    let footer = await Footer.findOne();

    // If no footer document exists, create default one
    if (!footer) {
      footer = await Footer.create(DEFAULT_FOOTER);
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

const updateSocialLinks = async (req, res) => {
  try {
    const { socialLinks } = req.body;

    if (!socialLinks) {
      return res.status(400).json({
        success: false,
        message: "socialLinks are required",
      });
    }

    // Update only provided social link fields
    const footer = await Footer.findOneAndUpdate(
      {},
      { 
        $set: {
          socialLinks: socialLinks,
        }
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Social links updated successfully",
      footer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update social links",
      error: error.message,
    });
  }
};

module.exports = {
  getFooter,
  updateSocialLinks,
};
