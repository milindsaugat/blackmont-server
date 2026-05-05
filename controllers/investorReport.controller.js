const mongoose = require("mongoose");

const InvestorReport = require("../models/investorReport.model");

const DEFAULT_REPORTS = [
  {
    categoryTag: "QUARTERLY",
    reportTitle: "Quarterly Capital Perspective",
    date: "APRIL 2026",
    downloadButtonLabel: "Download PDF",
    fileSource: "externalUrl",
    externalUrl: "https://example.com/quarterly-capital-perspective.pdf",
    isPublished: true,
    order: 1,
  },
  {
    categoryTag: "INSIGHT",
    reportTitle: "Custody & Stewardship Review",
    date: "MAY 2026",
    downloadButtonLabel: "Download PDF",
    fileSource: "externalUrl",
    externalUrl: "https://example.com/custody-stewardship-review.pdf",
    isPublished: true,
    order: 2,
  },
  {
    categoryTag: "COMMENTARY",
    reportTitle: "Physical Gold Strategy Commentary",
    date: "JUNE 2026",
    downloadButtonLabel: "Download PDF",
    fileSource: "externalUrl",
    externalUrl: "https://example.com/physical-gold-strategy-commentary.pdf",
    isPublished: true,
    order: 3,
  },
];

const SORT_ORDER = { order: 1, createdAt: -1 };

function isValidReportId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

async function seedDefaultReports() {
  const count = await InvestorReport.countDocuments();

  if (count === 0) {
    await InvestorReport.insertMany(DEFAULT_REPORTS);
  }
}

async function getInvestorReports(req, res) {
  try {
    await seedDefaultReports();

    const data = await InvestorReport.find({ isPublished: true }).sort(SORT_ORDER);

    res.status(200).json({
      success: true,
      message: "Investor reports fetched successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch investor reports",
      error: error.message,
    });
  }
}

async function getSingleInvestorReport(req, res) {
  try {
    await seedDefaultReports();

    if (!isValidReportId(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: "Investor report not found",
        data: null,
      });
    }

    const data = await InvestorReport.findOne({
      _id: req.params.id,
      isPublished: true,
    });

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Investor report not found",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "Investor report fetched successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch investor report",
      error: error.message,
    });
  }
}

module.exports = {
  getInvestorReports,
  getSingleInvestorReport,
};
