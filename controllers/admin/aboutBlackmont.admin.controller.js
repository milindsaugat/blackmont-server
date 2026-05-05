const AboutBlackmont = require("../../models/aboutBlackmont.model");

const getOrCreateAboutBlackmont = async () => {
  let aboutBlackmont = await AboutBlackmont.findOne();

  if (!aboutBlackmont) {
    aboutBlackmont = await AboutBlackmont.create({});
  }

  return aboutBlackmont;
};

const normalizeContentSections = (sections) => {
  if (!Array.isArray(sections)) return undefined;

  return sections.map((section, index) => {
    const normalized = {
      sectionNumber: section?.sectionNumber || "",
      title: section?.title || "",
      paragraphs: Array.isArray(section?.paragraphs)
        ? section.paragraphs.map((paragraph) => String(paragraph || ""))
        : [],
      order:
        section?.order !== undefined && Number.isFinite(Number(section.order))
          ? Number(section.order)
          : index + 1,
      published:
        section?.published === undefined
          ? true
          : section.published === true || section.published === "true",
    };

    if (section?._id) normalized._id = section._id;

    return normalized;
  });
};

const getAdminAboutBlackmont = async (req, res) => {
  try {
    const aboutBlackmont = await getOrCreateAboutBlackmont();

    res.status(200).json({
      success: true,
      message: "About Blackmont fetched successfully",
      data: aboutBlackmont,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch About Blackmont",
      error: error.message,
    });
  }
};

const updateAboutBlackmont = async (req, res) => {
  try {
    const { introText, contentSections, footerStatement } = req.body;
    const updateData = {};

    if (introText !== undefined) updateData.introText = introText;
    if (footerStatement !== undefined) {
      updateData.footerStatement = footerStatement;
    }

    const normalizedSections = normalizeContentSections(contentSections);
    if (normalizedSections !== undefined) {
      updateData.contentSections = normalizedSections;
    }

    const aboutBlackmont = await AboutBlackmont.findOneAndUpdate(
      {},
      { $set: updateData },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "About Blackmont updated successfully",
      data: aboutBlackmont,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update About Blackmont",
      error: error.message,
    });
  }
};

module.exports = {
  getAdminAboutBlackmont,
  updateAboutBlackmont,
};
