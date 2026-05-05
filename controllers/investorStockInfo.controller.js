const InvestorStockInfo = require("../models/investorStockInfo.model");

const DEFAULT_LEFT_CARDS = [
  {
    badgePrefixText: "CARD 01",
    cardTitle: "Private Capital Model",
    cardDescription:
      "Blackmont operates within a private capital context centred on stewardship discipline, long-term alignment, and selective strategic engagement.",
    order: 1,
  },
  {
    badgePrefixText: "CARD 02",
    cardTitle: "Asset-backed Exposure",
    cardDescription:
      "Physical gold holdings remain central to the firm's positioning, reflecting a custody-conscious and asset-backed approach to wealth structure.",
    order: 2,
  },
  {
    badgePrefixText: "CARD 03",
    cardTitle: "Long-term Preservation Strategy",
    cardDescription:
      "The broader capital philosophy prioritises preservation, measured utilisation, and institutional clarity over short-term market orientation.",
    order: 3,
  },
];

const DEFAULT_STOCK_INFO_ITEMS = [
  {
    label: "CAPITAL POSITIONING",
    value: "Private Asset Alignment",
    order: 1,
  },
  {
    label: "STRATEGIC VIEW",
    value: "Preservation-Led Structure",
    order: 2,
  },
  {
    label: "POSITIONING VIEW",
    value: "Structural outlook",
    order: 3,
  },
];

function sortInvestorStockInfo(stockInfo) {
  stockInfo.leftCards.sort((a, b) => (a.order || 0) - (b.order || 0));
  stockInfo.stockInfoItems.sort((a, b) => (a.order || 0) - (b.order || 0));
}

async function getOrCreateInvestorStockInfo() {
  let stockInfo = await InvestorStockInfo.findOne();

  if (!stockInfo) {
    stockInfo = await InvestorStockInfo.create({
      leftCards: DEFAULT_LEFT_CARDS,
      stockInfoItems: DEFAULT_STOCK_INFO_ITEMS,
      isActive: true,
    });
  }

  sortInvestorStockInfo(stockInfo);
  return stockInfo;
}

async function getInvestorStockInfo(req, res) {
  try {
    const stockInfo = await getOrCreateInvestorStockInfo();
    const data = stockInfo.isActive ? stockInfo : null;

    res.status(200).json({
      success: true,
      message: data
        ? "Investor stock information fetched successfully"
        : "Investor stock information is inactive",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch investor stock information",
      data: null,
    });
  }
}

module.exports = {
  getInvestorStockInfo,
};
