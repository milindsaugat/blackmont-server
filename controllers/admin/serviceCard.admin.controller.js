const mongoose = require("mongoose");
const ServiceCard = require("../../models/serviceCard.model");

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

function buildUpdateData(body) {
  const allowedFields = [
    "badgeIcon",
    "badgeLabel",
    "title",
    "description",
    "bottomTagline",
    "order",
    "isActive",
  ];

  const updateData = {};

  allowedFields.forEach((field) => {
    if (body[field] !== undefined) {
      updateData[field] = body[field];
    }
  });

  return updateData;
}

async function createServiceCard(req, res) {
  try {
    const {
      badgeIcon,
      badgeLabel,
      title,
      description,
      bottomTagline,
      order,
      isActive,
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required",
        data: null,
      });
    }

    const data = await ServiceCard.create({
      badgeIcon,
      badgeLabel,
      title,
      description,
      bottomTagline,
      order,
      isActive,
    });

    res.status(201).json({
      success: true,
      message: "Service card created successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create service card",
      error: error.message,
    });
  }
}

async function getAdminServiceCards(req, res) {
  try {
    await seedDefaultServiceCards();

    const data = await ServiceCard.find().sort({ order: 1, createdAt: 1 });

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

async function getAdminServiceCardById(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: "Service card not found",
        data: null,
      });
    }

    const data = await ServiceCard.findById(id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Service card not found",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "Service card fetched successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch service card",
      error: error.message,
    });
  }
}

async function updateServiceCard(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: "Service card not found",
        data: null,
      });
    }

    const updateData = buildUpdateData(req.body);

    const data = await ServiceCard.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Service card not found",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "Service card updated successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update service card",
      error: error.message,
    });
  }
}

async function deleteServiceCard(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: "Service card not found",
        data: null,
      });
    }

    const data = await ServiceCard.findByIdAndDelete(id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Service card not found",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "Service card deleted successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete service card",
      error: error.message,
    });
  }
}

module.exports = {
  createServiceCard,
  getAdminServiceCards,
  getAdminServiceCardById,
  updateServiceCard,
  deleteServiceCard,
};
