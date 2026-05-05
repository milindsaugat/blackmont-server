const WhyBlackmont = require("../models/whyBlackmont.model");

const DEFAULT_WHY_BLACKMONT = {
  eyebrowLabel: "THE BLACKMONT STANDARD",
  mainHeading: "Uncompromising Institutional Integrity",
  subHeading:
    "Built on trust, governance, and disciplined execution for long-term capital partners.",
  featureColumns: [
    {
      number: "01",
      title: "Absolute Ownership Clarity",
      description:
        "Direct ownership models with verifiable audit trails, zero-compromise documentation, and unencumbered title.",
      order: 1,
    },
    {
      number: "02",
      title: "Governance & Stewardship",
      description:
        "Rigorous internal controls, periodic external audits by global top-tier firms, and dedicated compliance frameworks.",
      order: 2,
    },
    {
      number: "03",
      title: "Institutional Professionalism",
      description:
        "A team drawn from global banking, logistics, and legal sectors delivering seamless execution and absolute discretion.",
      order: 3,
    },
  ],
  isActive: true,
};

const sortFeatureColumns = (doc) => {
  if (doc?.featureColumns) {
    doc.featureColumns.sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  if (doc?.features) {
    doc.features.sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  return doc;
};

const getWhyBlackmont = async (req, res) => {
  try {
    let data = await WhyBlackmont.findOne({ isActive: true });

    if (!data) {
      const existingData = await WhyBlackmont.findOne();

      if (existingData) {
        return res.status(404).json({
          success: false,
          message: "Why Blackmont section not found",
          data: null,
        });
      }

      data = await WhyBlackmont.create(DEFAULT_WHY_BLACKMONT);
    }

    sortFeatureColumns(data);

    res.status(200).json({
      success: true,
      message: "Why Blackmont section fetched successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch Why Blackmont section",
      error: error.message,
    });
  }
};

module.exports = {
  getWhyBlackmont,
};
