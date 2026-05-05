const express = require("express");
const router = express.Router();

const {
  getNewsroom,
  getNewsroomArticleById,
  getNewsroomArticleBySlug,
} = require("../../controllers/newsroom.controller");

router.get("/newsroom", getNewsroom);
router.get("/newsroom/articles/:articleId", getNewsroomArticleById);
router.get("/newsroom/:slug", getNewsroomArticleBySlug);

module.exports = router;
