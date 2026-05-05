const mongoose = require("mongoose");

const investorEventSchema = new mongoose.Schema(
  {
    categoryTag: {
      type: String,
      required: true,
    },
    eventTitle: {
      type: String,
      required: true,
    },
    date: {
      type: String,
    },
    buttonLabel: {
      type: String,
      default: "View Presentation",
    },
    description: {
      type: String,
      required: true,
    },
    fileSource: {
      type: String,
      enum: ["uploadFile", "externalUrl"],
      default: "externalUrl",
    },
    uploadedFileUrl: {
      type: String,
      default: "",
    },
    fileName: {
      type: String,
      trim: true,
      default: "",
    },
    fileSize: {
      type: String,
      trim: true,
      default: "",
    },
    externalUrl: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["upcoming", "completed", "outlined"],
      default: "outlined",
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("InvestorEvent", investorEventSchema);
