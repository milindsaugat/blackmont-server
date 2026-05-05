const AboutBlackmont = require("../models/aboutBlackmont.model");

const getOrCreateAboutBlackmont = async () => {
  let aboutBlackmont = await AboutBlackmont.findOne();

  if (!aboutBlackmont) {
    aboutBlackmont = await AboutBlackmont.create({});
  }

  return aboutBlackmont;
};

const getPublicAboutBlackmont = async (req, res) => {
  try {
    const aboutBlackmont = await getOrCreateAboutBlackmont();
    const data = aboutBlackmont.toObject();

    data.contentSections = (data.contentSections || [])
      .filter((section) => section.published)
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    res.status(200).json({
      success: true,
      data: {
        introText: data.introText,
        contentSections: data.contentSections,
        footerStatement: data.footerStatement,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch About Blackmont",
      error: error.message,
    });
  }
};

module.exports = {
  getPublicAboutBlackmont,
};
