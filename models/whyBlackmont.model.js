const mongoose = require("mongoose");

const featureColumnSchema = new mongoose.Schema(
  {
    number: {
      type: String,
      trim: true,
      default: "",
    },
    title: {
      type: String,
      trim: true,
      default: "",
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { _id: true }
);

const whyBlackmontSchema = new mongoose.Schema(
  {
    eyebrowLabel: {
      type: String,
      trim: true,
      default: "",
    },
    mainHeading: {
      type: String,
      trim: true,
      default: "",
    },
    subHeading: {
      type: String,
      trim: true,
      default: "",
    },
    featureColumns: {
      type: [featureColumnSchema],
      default: [],
    },
    features: {
      type: [featureColumnSchema],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WhyBlackmont", whyBlackmontSchema);
