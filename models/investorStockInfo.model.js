const mongoose = require("mongoose");

const leftCardSchema = new mongoose.Schema(
  {
    badgePrefixText: {
      type: String,
      trim: true,
      default: "",
    },
    cardTitle: {
      type: String,
      required: true,
      trim: true,
    },
    cardDescription: {
      type: String,
      required: true,
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  }
);

const stockInfoItemSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true,
    },
    value: {
      type: String,
      required: true,
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  }
);

const investorStockInfoSchema = new mongoose.Schema(
  {
    leftCards: [leftCardSchema],
    stockInfoItems: [stockInfoItemSchema],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("InvestorStockInfo", investorStockInfoSchema);
