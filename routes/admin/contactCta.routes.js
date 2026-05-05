const express = require("express");
const router = express.Router();

const adminAuthMiddleware = require("../../middlewares/adminAuth.middleware");

const {
  getContactCtaAdmin,
  upsertContactCta,
} = require("../../controllers/admin/contactCta.admin.controller");

router.get("/contact-cta", adminAuthMiddleware, getContactCtaAdmin);
router.patch("/contact-cta", adminAuthMiddleware, upsertContactCta);

module.exports = router;
