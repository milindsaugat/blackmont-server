const Legal = require("../models/legal.model");

const VALID_TYPES = ["faq", "terms", "privacy"];

const isValidType = (type) => VALID_TYPES.includes(type);

const getPublicLegalSectionByType = async (req, res) => {
  try {
    const { type } = req.params;

    if (!isValidType(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid legal section type. Allowed types: faq, terms, privacy",
        data: null,
      });
    }

    const legalSection = await Legal.findOne({ type, isActive: true });

    if (!legalSection) {
      return res.status(404).json({
        success: false,
        message: "Legal section not found",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Legal section fetched successfully",
      data: legalSection,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch legal section",
      data: null,
      error: error.message,
    });
  }
};

const getPublicAllLegalSections = async (req, res) => {
  try {
    const legalSections = await Legal.find({ isActive: true }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Legal sections fetched successfully",
      data: legalSections,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch legal sections",
      data: null,
      error: error.message,
    });
  }
};

module.exports = {
  getPublicLegalSectionByType,
  getPublicAllLegalSections,
};
