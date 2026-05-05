const InvestorOverview = require("../../models/investorOverview.model");

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

const VALID_DOWNLOAD_TYPES = ["noButton", "uploadFile", "externalUrl"];

async function getOrCreateInvestorOverview() {
  let overview = await InvestorOverview.findOne();

  if (!overview) {
    overview = await InvestorOverview.create({
      frameworkCards: DEFAULT_FRAMEWORK_CARDS,
      isActive: true,
    });
  }

  sortFrameworkCards(overview);
  return overview;
}

function sortFrameworkCards(overview) {
  overview.frameworkCards.sort((a, b) => (a.order || 0) - (b.order || 0));
}

function parseBoolean(value, fallback = true) {
  if (value === undefined) return fallback;
  if (typeof value === "boolean") return value;
  return value === "true";
}

function parseOrder(value, fallback = 0) {
  if (value === undefined || value === "") return fallback;

  const order = Number(value);
  return Number.isFinite(order) ? order : fallback;
}

function buildUploadedFileUrl(req) {
  return `${req.protocol}://${req.get(
    "host"
  )}/uploads/investor-overview/${req.file.filename}`;
}

function buildFrameworkCardData(req, existingCard = null) {
  const downloadButtonType =
    req.body.downloadButtonType ||
    existingCard?.downloadButtonType ||
    "noButton";

  if (!VALID_DOWNLOAD_TYPES.includes(downloadButtonType)) {
    return {
      error:
        "downloadButtonType must be one of noButton, uploadFile, or externalUrl",
    };
  }

  const cardTitle = (req.body.cardTitle ?? existingCard?.cardTitle ?? "").trim();
  const cardDescription = (
    req.body.cardDescription ??
    existingCard?.cardDescription ??
    ""
  ).trim();

  if (!cardTitle || !cardDescription) {
    return { error: "cardTitle and cardDescription are required" };
  }

  const data = {
    cardTitle,
    cardDescription,
    downloadButtonType,
    uploadedFileUrl: existingCard?.uploadedFileUrl || "",
    externalUrl: existingCard?.externalUrl || "",
    showTopGoldDividerLine: parseBoolean(
      req.body.showTopGoldDividerLine,
      existingCard?.showTopGoldDividerLine ?? true
    ),
    order: parseOrder(req.body.order, existingCard?.order ?? 0),
  };

  if (downloadButtonType === "uploadFile") {
    data.externalUrl = "";
    data.uploadedFileUrl = req.file
      ? buildUploadedFileUrl(req)
      : data.uploadedFileUrl;
  }

  if (downloadButtonType === "externalUrl") {
    data.uploadedFileUrl = "";
    data.externalUrl = (req.body.externalUrl ?? data.externalUrl ?? "").trim();
  }

  if (downloadButtonType === "noButton") {
    data.uploadedFileUrl = "";
    data.externalUrl = "";
  }

  return { data };
}

async function getInvestorOverviewAdmin(req, res) {
  try {
    const data = await getOrCreateInvestorOverview();

    res.status(200).json({
      success: true,
      message: "Investor overview CMS fetched successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch investor overview CMS",
      error: error.message,
    });
  }
}

async function addFrameworkCard(req, res) {
  try {
    const overview = await getOrCreateInvestorOverview();
    const { data, error } = buildFrameworkCardData(req);

    if (error) {
      return res.status(400).json({ success: false, message: error, data: null });
    }

    const createdCard = overview.frameworkCards.create(data);
    overview.frameworkCards.push(createdCard);
    sortFrameworkCards(overview);
    await overview.save();
    const savedCard = overview.frameworkCards.id(createdCard._id);

    res.status(201).json({
      success: true,
      message: "Framework card added successfully",
      data: savedCard.toObject(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add framework card",
      error: error.message,
    });
  }
}

async function updateFrameworkCard(req, res) {
  try {
    const overview = await getOrCreateInvestorOverview();
    const card = overview.frameworkCards.id(req.params.cardId);

    if (!card) {
      return res.status(404).json({
        success: false,
        message: "Framework card not found",
        data: null,
      });
    }

    const { data, error } = buildFrameworkCardData(req, card);

    if (error) {
      return res.status(400).json({ success: false, message: error, data: null });
    }

    card.set(data);
    sortFrameworkCards(overview);
    await overview.save();
    const savedCard = overview.frameworkCards.id(card._id);

    res.status(200).json({
      success: true,
      message: "Framework card updated successfully",
      data: savedCard.toObject(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update framework card",
      error: error.message,
    });
  }
}

async function deleteFrameworkCard(req, res) {
  try {
    const overview = await getOrCreateInvestorOverview();
    const card = overview.frameworkCards.id(req.params.cardId);

    if (!card) {
      return res.status(404).json({
        success: false,
        message: "Framework card not found",
        data: null,
      });
    }

    const deletedCard = card.toObject();
    card.deleteOne();
    sortFrameworkCards(overview);
    await overview.save();

    res.status(200).json({
      success: true,
      message: "Framework card deleted successfully",
      data: deletedCard,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete framework card",
      error: error.message,
    });
  }
}

module.exports = {
  getInvestorOverviewAdmin,
  addFrameworkCard,
  updateFrameworkCard,
  deleteFrameworkCard,
};
