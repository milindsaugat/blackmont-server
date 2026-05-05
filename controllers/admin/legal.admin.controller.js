const Legal = require("../../models/legal.model");

const VALID_TYPES = ["faq", "terms", "privacy"];

const isValidType = (type) => VALID_TYPES.includes(type);

const cleanFaqs = (faqs = []) =>
  faqs.map((item) => ({
    question: item?.question || "",
    answer: item?.answer || "",
  }));

const buildLegalPayload = (type, body) => {
  const payload = {
    type,
  };

  if (body.eyebrowLabel !== undefined) {
    payload.eyebrowLabel = body.eyebrowLabel;
  }

  if (body.title !== undefined) {
    payload.title = body.title;
  }

  if (body.subtitle !== undefined) {
    payload.subtitle = body.subtitle;
  }

  if (body.isActive !== undefined) {
    payload.isActive = body.isActive;
  }

  if (type === "faq") {
    if (body.faqs !== undefined) {
      payload.faqs = cleanFaqs(body.faqs);
    }

    payload.content = "";
  } else {
    if (body.content !== undefined) {
      payload.content = body.content;
    }

    payload.faqs = [];
  }

  return payload;
};

const saveLegalSection = async (req, res) => {
  try {
    const { type } = req.params;

    if (!isValidType(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid legal section type. Allowed types: faq, terms, privacy",
        data: null,
      });
    }

    if (type === "faq" && req.body.faqs !== undefined && !Array.isArray(req.body.faqs)) {
      return res.status(400).json({
        success: false,
        message: "FAQs must be an array",
        data: null,
      });
    }

    const payload = buildLegalPayload(type, req.body);

    const legalSection = await Legal.findOneAndUpdate(
      { type },
      { $set: payload },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Legal section saved successfully",
      data: legalSection,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to save legal section",
      data: null,
      error: error.message,
    });
  }
};

const createOrUpdateLegalSection = saveLegalSection;
const updateLegalSection = saveLegalSection;

const getAllLegalSections = async (req, res) => {
  try {
    const legalSections = await Legal.find().sort({ createdAt: -1 });

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

const getLegalSectionByType = async (req, res) => {
  try {
    const { type } = req.params;

    if (!isValidType(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid legal section type. Allowed types: faq, terms, privacy",
        data: null,
      });
    }

    const legalSection = await Legal.findOne({ type });

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

const deleteLegalSectionByType = async (req, res) => {
  try {
    const { type } = req.params;

    if (!isValidType(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid legal section type. Allowed types: faq, terms, privacy",
        data: null,
      });
    }

    const legalSection = await Legal.findOneAndDelete({ type });

    if (!legalSection) {
      return res.status(404).json({
        success: false,
        message: "Legal section not found",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Legal section deleted successfully",
      data: legalSection,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete legal section",
      data: null,
      error: error.message,
    });
  }
};

module.exports = {
  createOrUpdateLegalSection,
  updateLegalSection,
  getAllLegalSections,
  getLegalSectionByType,
  deleteLegalSectionByType,
};
