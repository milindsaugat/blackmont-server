const express = require("express");
const router = express.Router();

const adminAuth = require("../../middlewares/adminAuth.middleware");

const {
  createOrUpdateLegalSection,
  updateLegalSection,
  getAllLegalSections,
  getLegalSectionByType,
  deleteLegalSectionByType,
} = require("../../controllers/admin/legal.admin.controller");

router.post("/:type", adminAuth, createOrUpdateLegalSection);
router.patch("/:type", adminAuth, updateLegalSection);
router.get("/", adminAuth, getAllLegalSections);
router.get("/:type", adminAuth, getLegalSectionByType);
router.delete("/:type", adminAuth, deleteLegalSectionByType);

module.exports = router;
