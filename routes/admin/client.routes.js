const express = require("express");
const router = express.Router();

const adminAuth = require("../../middlewares/adminAuth.middleware");

const {
  getAllClients,
  getSingleClient,
  createClient,
  updateClient,
  deleteClient,
} = require("../../controllers/admin/client.admin.controller");

router.get("/", adminAuth, getAllClients);
router.get("/:id", adminAuth, getSingleClient);
router.post("/", adminAuth, createClient);
router.patch("/:id", adminAuth, updateClient);
router.delete("/:id", adminAuth, deleteClient);

module.exports = router;
