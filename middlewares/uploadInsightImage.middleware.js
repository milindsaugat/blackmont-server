const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure insights uploads directory exists
const insightsUploadDir = path.join(__dirname, "../uploads/insights");
try {
  if (!fs.existsSync(insightsUploadDir)) {
    fs.mkdirSync(insightsUploadDir, { recursive: true });
  }
} catch (error) {
  console.warn("Could not create uploads directory:", insightsUploadDir, error.message);
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, insightsUploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "insight-" + uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  const allowedMimes = ["image/jpeg", "image/png", "image/webp"];
  const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];

  const fileExtension = path.extname(file.originalname).toLowerCase();

  if (
    allowedMimes.includes(file.mimetype) &&
    allowedExtensions.includes(fileExtension)
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only jpg, jpeg, png, and webp files are allowed"
      ),
      false
    );
  }
};

// Create multer upload middleware
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

module.exports = upload;
