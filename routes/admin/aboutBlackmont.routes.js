const express = require("express");
const router = express.Router();

const adminAuth = require("../../middlewares/adminAuth.middleware");
const {
  getAdminAboutBlackmont,
  updateAboutBlackmont,
} = require("../../controllers/admin/aboutBlackmont.admin.controller");

router.get("/about-blackmont", adminAuth, getAdminAboutBlackmont);
router.patch("/about-blackmont", adminAuth, updateAboutBlackmont);

module.exports = router;
