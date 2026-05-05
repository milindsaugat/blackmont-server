const express = require("express");
const router = express.Router();

const adminAuthMiddleware = require("../../middlewares/adminAuth.middleware");

const {
  getAdminHomeAbout,
  updateHomeAbout,
  addHomeAboutImage,
  deleteHomeAboutImage,
  addHomeAboutCard,
  deleteHomeAboutCard,
} = require("../../controllers/admin/homeAbout.admin.controller");

router.get("/", adminAuthMiddleware, getAdminHomeAbout);
router.patch("/", adminAuthMiddleware, updateHomeAbout);

router.post("/images", adminAuthMiddleware, addHomeAboutImage);
router.delete("/images/:imageId", adminAuthMiddleware, deleteHomeAboutImage);

router.post("/cards", adminAuthMiddleware, addHomeAboutCard);
router.delete("/cards/:cardId", adminAuthMiddleware, deleteHomeAboutCard);

module.exports = router;