const InvestorStockInfo = require("../../models/investorStockInfo.model");

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

function parseOrder(value, fallback = 0) {
  if (value === undefined || value === "") return fallback;

  const order = Number(value);
  return Number.isFinite(order) ? order : fallback;
}

function buildLeftCardData(body, existingCard = null) {
  const cardTitle = (body.cardTitle ?? existingCard?.cardTitle ?? "").trim();
  const cardDescription = (
    body.cardDescription ??
    existingCard?.cardDescription ??
    ""
  ).trim();

  if (!cardTitle || !cardDescription) {
    return { error: "cardTitle and cardDescription are required" };
  }

  return {
    data: {
      badgePrefixText: (
        body.badgePrefixText ??
        existingCard?.badgePrefixText ??
        ""
      ).trim(),
      cardTitle,
      cardDescription,
      order: parseOrder(body.order, existingCard?.order ?? 0),
    },
  };
}

function buildStockInfoItemData(body, existingItem = null) {
  const label = (body.label ?? existingItem?.label ?? "").trim();
  const value = (body.value ?? existingItem?.value ?? "").trim();

  if (!label || !value) {
    return { error: "label and value are required" };
  }

  return {
    data: {
      label,
      value,
      order: parseOrder(body.order, existingItem?.order ?? 0),
    },
  };
}

async function getInvestorStockInfoAdmin(req, res) {
  try {
    const data = await getOrCreateInvestorStockInfo();

    res.status(200).json({
      success: true,
      message: "Investor stock information CMS fetched successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch investor stock information CMS",
      data: null,
    });
  }
}

async function addLeftCard(req, res) {
  try {
    const stockInfo = await getOrCreateInvestorStockInfo();
    const { data, error } = buildLeftCardData(req.body);

    if (error) {
      return res.status(400).json({ success: false, message: error, data: null });
    }

    const createdCard = stockInfo.leftCards.create(data);
    stockInfo.leftCards.push(createdCard);
    sortInvestorStockInfo(stockInfo);
    await stockInfo.save();

    res.status(201).json({
      success: true,
      message: "Left card added successfully",
      data: createdCard,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add left card",
      data: null,
    });
  }
}

async function updateLeftCard(req, res) {
  try {
    const stockInfo = await getOrCreateInvestorStockInfo();
    const card = stockInfo.leftCards.id(req.params.cardId);

    if (!card) {
      return res.status(404).json({
        success: false,
        message: "Left card not found",
        data: null,
      });
    }

    const { data, error } = buildLeftCardData(req.body, card);

    if (error) {
      return res.status(400).json({ success: false, message: error, data: null });
    }

    card.set(data);
    sortInvestorStockInfo(stockInfo);
    await stockInfo.save();

    res.status(200).json({
      success: true,
      message: "Left card updated successfully",
      data: card,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update left card",
      data: null,
    });
  }
}

async function deleteLeftCard(req, res) {
  try {
    const stockInfo = await getOrCreateInvestorStockInfo();
    const card = stockInfo.leftCards.id(req.params.cardId);

    if (!card) {
      return res.status(404).json({
        success: false,
        message: "Left card not found",
        data: null,
      });
    }

    const deletedCard = card.toObject();
    card.deleteOne();
    sortInvestorStockInfo(stockInfo);
    await stockInfo.save();

    res.status(200).json({
      success: true,
      message: "Left card deleted successfully",
      data: deletedCard,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete left card",
      data: null,
    });
  }
}

async function addStockInfoItem(req, res) {
  try {
    const stockInfo = await getOrCreateInvestorStockInfo();
    const { data, error } = buildStockInfoItemData(req.body);

    if (error) {
      return res.status(400).json({ success: false, message: error, data: null });
    }

    const createdItem = stockInfo.stockInfoItems.create(data);
    stockInfo.stockInfoItems.push(createdItem);
    sortInvestorStockInfo(stockInfo);
    await stockInfo.save();

    res.status(201).json({
      success: true,
      message: "Stock info item added successfully",
      data: createdItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add stock info item",
      data: null,
    });
  }
}

async function updateStockInfoItem(req, res) {
  try {
    const stockInfo = await getOrCreateInvestorStockInfo();
    const item = stockInfo.stockInfoItems.id(req.params.itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Stock info item not found",
        data: null,
      });
    }

    const { data, error } = buildStockInfoItemData(req.body, item);

    if (error) {
      return res.status(400).json({ success: false, message: error, data: null });
    }

    item.set(data);
    sortInvestorStockInfo(stockInfo);
    await stockInfo.save();

    res.status(200).json({
      success: true,
      message: "Stock info item updated successfully",
      data: item,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update stock info item",
      data: null,
    });
  }
}

async function deleteStockInfoItem(req, res) {
  try {
    const stockInfo = await getOrCreateInvestorStockInfo();
    const item = stockInfo.stockInfoItems.id(req.params.itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Stock info item not found",
        data: null,
      });
    }

    const deletedItem = item.toObject();
    item.deleteOne();
    sortInvestorStockInfo(stockInfo);
    await stockInfo.save();

    res.status(200).json({
      success: true,
      message: "Stock info item deleted successfully",
      data: deletedItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete stock info item",
      data: null,
    });
  }
}

module.exports = {
  getInvestorStockInfoAdmin,
  addLeftCard,
  updateLeftCard,
  deleteLeftCard,
  addStockInfoItem,
  updateStockInfoItem,
  deleteStockInfoItem,
};
