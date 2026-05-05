const InvestorOverview = require("../models/investorOverview.model");

const DEFAULT_FRAMEWORK_CARDS = [
  {
    cardTitle: "Global Custody Framework",
    cardDescription:
      "A custody-led operating model designed around jurisdictional clarity, professional control, and disciplined asset stewardship.",
    downloadButtonType: "externalUrl",
    uploadedFileUrl: "",
    externalUrl: "https://example.com/investor-overview.pdf",
    showTopGoldDividerLine: true,
    order: 1,
  },
  {
    cardTitle: "Institutional Governance",
    cardDescription:
      "Structured internal procedures and reporting practices that support transparent oversight and long-term capital confidence.",
    downloadButtonType: "externalUrl",
    uploadedFileUrl: "",
    externalUrl: "https://example.com/investor-governance.pdf",
    showTopGoldDividerLine: true,
    order: 2,
  },
  {
    cardTitle: "Asset-backed Wealth Strategy",
    cardDescription:
      "A precious metals approach intended to align physical asset ownership with broader preservation and strategic planning objectives.",
    downloadButtonType: "externalUrl",
    uploadedFileUrl: "",
    externalUrl: "https://example.com/wealth-strategy.pdf",
    showTopGoldDividerLine: true,
    order: 3,
  },
];

async function getOrCreateInvestorOverview() {
  let overview = await InvestorOverview.findOne();

  if (!overview) {
    overview = await InvestorOverview.create({
      frameworkCards: DEFAULT_FRAMEWORK_CARDS,
      isActive: true,
    });
  }

  overview.frameworkCards.sort((a, b) => (a.order || 0) - (b.order || 0));
  return overview;
}

async function getInvestorOverview(req, res) {
  try {
    const overview = await getOrCreateInvestorOverview();
    const data = overview.isActive ? overview : null;

    res.status(200).json({
      success: true,
      message: data
        ? "Investor overview fetched successfully"
        : "Investor overview is inactive",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch investor overview",
      error: error.message,
    });
  }
}

module.exports = {
  getInvestorOverview,
};
