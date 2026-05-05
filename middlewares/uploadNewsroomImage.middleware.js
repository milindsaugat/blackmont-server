const multer = require("multer");
const path = require("path");
const fs = require("fs");

const newsroomUploadDir = path.join(__dirname, "../uploads/newsroom");

try {
  if (!fs.existsSync(newsroomUploadDir)) {
    fs.mkdirSync(newsroomUploadDir, { recursive: true });
  }
} catch (error) {
  console.warn("Could not create uploads directory:", newsroomUploadDir, error.message);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, newsroomUploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "newsroom-" + uniqueSuffix + path.extname(file.originalname));
  },
});

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
    cb(new Error("Only jpg, jpeg, png, and webp files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

module.exports = upload;
