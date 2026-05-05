const express = require("express");
const router = express.Router();

const adminAuth = require("../../middlewares/adminAuth.middleware");
const upload = require("../../middlewares/uploadNewsroomImage.middleware");

const {
  getNewsroomAdmin,
  upsertNewsroomHeader,
  addNewsroomArticle,
  updateNewsroomArticle,
  deleteNewsroomArticle,
  toggleNewsroomArticlePublished,
} = require("../../controllers/admin/newsroom.admin.controller");

router.get("/newsroom", adminAuth, getNewsroomAdmin);
router.patch("/newsroom", adminAuth, upsertNewsroomHeader);
router.post(
  "/newsroom/articles",
  adminAuth,
  upload.single("thumbnail"),
  addNewsroomArticle
);
router.patch(
  "/newsroom/articles/:articleId",
  adminAuth,
  upload.single("thumbnail"),
  updateNewsroomArticle
);
router.delete("/newsroom/articles/:articleId", adminAuth, deleteNewsroomArticle);
router.patch(
  "/newsroom/articles/:articleId/published",
  adminAuth,
  toggleNewsroomArticlePublished
);

module.exports = router;
