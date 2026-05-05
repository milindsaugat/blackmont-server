const multer = require("multer");
const path = require("path");
const fs = require("fs");

const investorOverviewUploadDir = path.join(
  __dirname,
  "../uploads/investor-overview"
);

try {
  if (!fs.existsSync(investorOverviewUploadDir)) {
    fs.mkdirSync(investorOverviewUploadDir, { recursive: true });
  }
} catch (error) {
  console.warn("Could not create uploads directory:", investorOverviewUploadDir, error.message);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, investorOverviewUploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "ir-card-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedExtensions = [
    ".pdf",
    ".doc",
    ".docx",
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
  ];
  const fileExtension = path.extname(file.originalname).toLowerCase();

  if (allowedExtensions.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new Error("Only pdf, doc, docx, jpg, jpeg, png, and webp files are allowed"), false);
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
