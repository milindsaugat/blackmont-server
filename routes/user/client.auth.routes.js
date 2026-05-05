const express = require("express");
const router = express.Router();

const clientAuth = require("../../middlewares/clientAuth.middleware");
const {
  clientLogin,
  getClientProfile,
} = require("../../controllers/client.auth.controller");

router.post("/login", clientLogin);
router.get("/profile", clientAuth, getClientProfile);

module.exports = router;
