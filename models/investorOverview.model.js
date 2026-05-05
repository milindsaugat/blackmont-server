const mongoose = require("mongoose");

const investorOverviewCardSchema = new mongoose.Schema(
  {
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
    downloadButtonType: {
      type: String,
      enum: ["noButton", "uploadFile", "externalUrl"],
      default: "noButton",
    },
    uploadedFileUrl: {
      type: String,
      trim: true,
      default: "",
    },
    externalUrl: {
      type: String,
      trim: true,
      default: "",
    },
    showTopGoldDividerLine: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  }
);

const investorOverviewSchema = new mongoose.Schema(
  {
    frameworkCards: [investorOverviewCardSchema],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("InvestorOverview", investorOverviewSchema);
