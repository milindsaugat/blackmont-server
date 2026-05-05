const mongoose = require("mongoose");

const insightHeaderSchema = new mongoose.Schema(
  {
    sectionEyebrowLabel: {
      type: String,
      default: "Insights & Commentary",
      trim: true,
    },
    sectionHeading: {
      type: String,
      default: "Blackmont Journal",
      trim: true,
    },
    sectionDescription: {
      type: String,
      default: "Perspectives on physical gold, wealth preservation, custody, and strategic asset stewardship.",
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("InsightHeader", insightHeaderSchema);
