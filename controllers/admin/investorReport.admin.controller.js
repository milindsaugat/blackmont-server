const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const InvestorReport = require("../../models/investorReport.model");

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

const VALID_FILE_SOURCES = ["uploadFile", "externalUrl"];
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
  )}/uploads/investor-reports/${req.file.filename}`;
}

function deleteUploadedFile(fileUrl) {
  if (!fileUrl) return;

  const marker = "/uploads/investor-reports/";
  const markerIndex = fileUrl.indexOf(marker);
  if (markerIndex === -1) return;

  const filename = fileUrl.slice(markerIndex + marker.length);
  const filePath = path.join(__dirname, "../../uploads/investor-reports", filename);

  fs.unlink(filePath, () => {});
}

function deleteRequestFile(req) {
  if (!req.file) return;

  deleteUploadedFile(buildUploadedFileUrl(req));
}

function buildReportData(req, existingReport = null) {
  const fileSource =
    req.body.fileSource || existingReport?.fileSource || "externalUrl";

  if (!VALID_FILE_SOURCES.includes(fileSource)) {
    return { error: "fileSource must be either uploadFile or externalUrl" };
  }

  const categoryTag = (
    req.body.categoryTag ??
    existingReport?.categoryTag ??
    ""
  ).trim();
  const reportTitle = (
    req.body.reportTitle ??
    existingReport?.reportTitle ??
    ""
  ).trim();

  if (!categoryTag || !reportTitle) {
    return { error: "categoryTag and reportTitle are required" };
  }

  const data = {
    categoryTag,
    reportTitle,
    date: (req.body.date ?? existingReport?.date ?? "").trim(),
    downloadButtonLabel: (
      req.body.downloadButtonLabel ??
      existingReport?.downloadButtonLabel ??
      "Download PDF"
    ).trim(),
    fileSource,
    uploadedFileUrl: existingReport?.uploadedFileUrl || "",
    fileName: existingReport?.fileName || "",
    fileSize: existingReport?.fileSize || "",
    externalUrl: existingReport?.externalUrl || "",
    isPublished: parseBoolean(
      req.body.isPublished,
      existingReport?.isPublished ?? true
    ),
    order: parseOrder(req.body.order, existingReport?.order ?? 0),
  };

  if (fileSource === "uploadFile") {
    data.externalUrl = "";
    if (req.file) {
      data.uploadedFileUrl = buildUploadedFileUrl(req);
      data.fileName = req.file.originalname;
      data.fileSize = `${(req.file.size / 1024).toFixed(1)} KB`;
    } else if (req.body.removeFile === "true") {
      data.uploadedFileUrl = "";
      data.fileName = "";
      data.fileSize = "";
    }
  }

  if (fileSource === "externalUrl") {
    data.uploadedFileUrl = "";
    data.fileName = "";
    data.fileSize = "";
    data.externalUrl = (req.body.externalUrl ?? data.externalUrl ?? "").trim();
  }

  return { data };
}

async function getInvestorReportsAdmin(req, res) {
  try {
    await seedDefaultReports();

    const data = await InvestorReport.find().sort(SORT_ORDER);

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

async function getSingleInvestorReportAdmin(req, res) {
  try {
    await seedDefaultReports();

    if (!isValidReportId(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: "Investor report not found",
        data: null,
      });
    }

    const data = await InvestorReport.findById(req.params.id);

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

async function createInvestorReport(req, res) {
  try {
    await seedDefaultReports();

    const { data, error } = buildReportData(req);

    if (error) {
      deleteRequestFile(req);
      return res.status(400).json({ success: false, message: error, data: null });
    }

    if (data.fileSource !== "uploadFile") {
      deleteRequestFile(req);
    }

    const createdReport = await InvestorReport.create(data);

    res.status(201).json({
      success: true,
      message: "Investor report created successfully",
      data: createdReport,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create investor report",
      error: error.message,
    });
  }
}

async function updateInvestorReport(req, res) {
  try {
    await seedDefaultReports();

    if (!isValidReportId(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: "Investor report not found",
        data: null,
      });
    }

    const report = await InvestorReport.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Investor report not found",
        data: null,
      });
    }

    const oldUploadedFileUrl = report.uploadedFileUrl;
    const { data, error } = buildReportData(req, report);

    if (error) {
      deleteRequestFile(req);
      return res.status(400).json({ success: false, message: error, data: null });
    }

    if (data.fileSource !== "uploadFile") {
      deleteRequestFile(req);
    }

    report.set(data);
    await report.save();

    if (oldUploadedFileUrl && oldUploadedFileUrl !== report.uploadedFileUrl) {
      deleteUploadedFile(oldUploadedFileUrl);
    }

    res.status(200).json({
      success: true,
      message: "Investor report updated successfully",
      data: report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update investor report",
      error: error.message,
    });
  }
}

async function deleteInvestorReport(req, res) {
  try {
    await seedDefaultReports();

    if (!isValidReportId(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: "Investor report not found",
        data: null,
      });
    }

    const report = await InvestorReport.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Investor report not found",
        data: null,
      });
    }

    const deletedReport = report.toObject();
    deleteUploadedFile(report.uploadedFileUrl);
    await report.deleteOne();

    res.status(200).json({
      success: true,
      message: "Investor report deleted successfully",
      data: deletedReport,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete investor report",
      error: error.message,
    });
  }
}

async function toggleInvestorReportPublished(req, res) {
  try {
    await seedDefaultReports();

    if (!isValidReportId(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: "Investor report not found",
        data: null,
      });
    }

    const report = await InvestorReport.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Investor report not found",
        data: null,
      });
    }

    report.isPublished =
      req.body.isPublished !== undefined
        ? parseBoolean(req.body.isPublished, report.isPublished)
        : !report.isPublished;

    await report.save();

    res.status(200).json({
      success: true,
      message: "Investor report published status updated successfully",
      data: report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update investor report published status",
      error: error.message,
    });
  }
}

module.exports = {
  getInvestorReportsAdmin,
  getSingleInvestorReportAdmin,
  createInvestorReport,
  updateInvestorReport,
  deleteInvestorReport,
  toggleInvestorReportPublished,
};
