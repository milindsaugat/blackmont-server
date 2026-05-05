const express = require("express");
const router = express.Router();

const adminAuth = require("../../middlewares/adminAuth.middleware");

const {
  getAllInquiries,
  getSingleInquiry,
  updateInquiryStatus,
  deleteInquiry,
} = require("../../controllers/admin/inquiry.admin.controller");

router.get("/", adminAuth, getAllInquiries);
router.get("/:id", adminAuth, getSingleInquiry);
router.patch("/:id/status", adminAuth, updateInquiryStatus);
router.delete("/:id", adminAuth, deleteInquiry);

module.exports = router;
