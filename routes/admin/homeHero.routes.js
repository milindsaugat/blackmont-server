const express = require("express");
const verifyAdminToken = require("../../middlewares/adminAuth.middleware");

const {
  getAdminHomeHero,
  upsertHomeHero,
} = require("../../controllers/admin/homeHero.admin.controller");

const router = express.Router();

router.get("/", verifyAdminToken, getAdminHomeHero);
router.patch("/", verifyAdminToken, upsertHomeHero);

module.exports = router;
