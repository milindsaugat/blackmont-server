const multer = require("multer");
const path = require("path");
const fs = require("fs");

const investorEventsUploadDir = path.join(
  __dirname,
  "../uploads/investor-events"
);

try {
  if (!fs.existsSync(investorEventsUploadDir)) {
    fs.mkdirSync(investorEventsUploadDir, { recursive: true });
  }
} catch (error) {
  console.warn("Could not create uploads directory:", investorEventsUploadDir, error.message);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, investorEventsUploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "investor-event-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedExtensions = [
    ".pdf",
    ".doc",
    ".docx",
    ".ppt",
    ".pptx",
  ];
  const fileExtension = path.extname(file.originalname).toLowerCase();

  if (allowedExtensions.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new Error("Only pdf, doc, docx, ppt, and pptx files are allowed"), false);
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
