const express = require("express");
const router = express.Router();

const adminAuth = require("../../middlewares/adminAuth.middleware");

const {
  createServiceCard,
  getAdminServiceCards,
  getAdminServiceCardById,
  updateServiceCard,
  deleteServiceCard,
} = require("../../controllers/admin/serviceCard.admin.controller");

router.post("/", adminAuth, createServiceCard);
router.get("/", adminAuth, getAdminServiceCards);
router.get("/:id", adminAuth, getAdminServiceCardById);
router.patch("/:id", adminAuth, updateServiceCard);
router.delete("/:id", adminAuth, deleteServiceCard);

module.exports = router;
