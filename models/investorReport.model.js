const mongoose = require("mongoose");

const investorReportSchema = new mongoose.Schema(
  {
    categoryTag: {
      type: String,
      required: true,
      trim: true,
    },
    reportTitle: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: String,
      trim: true,
      default: "",
    },
    downloadButtonLabel: {
      type: String,
      trim: true,
      default: "Download PDF",
    },
    fileSource: {
      type: String,
      enum: ["uploadFile", "externalUrl"],
      default: "externalUrl",
    },
    uploadedFileUrl: {
      type: String,
      trim: true,
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
      trim: true,
      default: "",
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
  { timestamps: true }
);

module.exports = mongoose.model("InvestorReport", investorReportSchema);
