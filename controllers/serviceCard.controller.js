const ServiceCard = require("../models/serviceCard.model");

const DEFAULT_SERVICE_CARDS = [
  {
    badgeIcon: "Trading",
    badgeLabel: "TRADING",
    title: "Physical Gold Trading",
    description:
      "Direct access to global bullion markets with institutional-grade pricing and seamless execution across major financial hubs.",
    bottomTagline:
      "STRUCTURED SOURCING, VERIFIABLE SUPPLY CHAIN, EXECUTION PRECISION.",
    order: 1,
    isActive: true,
  },
  {
    badgeIcon: "Custody",
    badgeLabel: "CUSTODY",
    title: "Secure Bullion Custody",
    description:
      "Tier-1 vaulting solutions with full insurance, periodic third-party audits, and geographically diversified storage.",
    bottomTagline:
      "SEGREGATED ACCOUNTS, NON-BANK INFRASTRUCTURE, SWISS-GRADE SECURITY.",
    order: 2,
    isActive: true,
  },
  {
    badgeIcon: "Utilisation",
    badgeLabel: "UTILISATION",
    title: "Gold Asset Utilisation",
    description:
      "Structured solutions designed to help clients unlock liquidity and strategic value from physical gold holdings.",
    bottomTagline:
      "COLLATERAL STRUCTURES, CAPITAL EFFICIENCY, LONG-TERM VALUE.",
    order: 3,
    isActive: true,
  },
  {
    badgeIcon: "Advisory",
    badgeLabel: "ADVISORY",
    title: "Strategic Advisory",
    description:
      "Specialised guidance for institutions, family offices, and private clients seeking disciplined precious metals exposure.",
    bottomTagline:
      "PORTFOLIO ALIGNMENT, MARKET INTELLIGENCE, INSTITUTIONAL CLARITY.",
    order: 4,
    isActive: true,
  },
];

async function seedDefaultServiceCards() {
  const count = await ServiceCard.countDocuments();

  if (count === 0) {
    await ServiceCard.insertMany(DEFAULT_SERVICE_CARDS);
  }
}

async function getPublicServiceCards(req, res) {
  try {
    await seedDefaultServiceCards();

    const data = await ServiceCard.find({ isActive: true }).sort({
      order: 1,
      createdAt: 1,
    });

    res.status(200).json({
      success: true,
      message: "Service cards fetched successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch service cards",
      error: error.message,
    });
  }
}

module.exports = {
  getPublicServiceCards,
};
