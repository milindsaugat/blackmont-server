const multer = require("multer");
const path = require("path");
const fs = require("fs");

const investorReportsUploadDir = path.join(
  __dirname,
  "../uploads/investor-reports"
);

try {
  if (!fs.existsSync(investorReportsUploadDir)) {
    fs.mkdirSync(investorReportsUploadDir, { recursive: true });
  }
} catch (error) {
  console.warn("Could not create uploads directory:", investorReportsUploadDir, error.message);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, investorReportsUploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "investor-report-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedExtensions = [
    ".pdf",
    ".doc",
    ".docx",
    ".xls",
    ".xlsx",
    ".ppt",
    ".pptx",
  ];
  const fileExtension = path.extname(file.originalname).toLowerCase();

  if (allowedExtensions.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new Error("Only pdf, doc, docx, xls, xlsx, ppt, and pptx files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
});

module.exports = upload;
