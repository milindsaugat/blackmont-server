const express = require("express");
const router = express.Router();

const adminAuth = require("../../middlewares/adminAuth.middleware");

const {
  getInvestorStockInfoAdmin,
  addLeftCard,
  updateLeftCard,
  deleteLeftCard,
  addStockInfoItem,
  updateStockInfoItem,
  deleteStockInfoItem,
} = require("../../controllers/admin/investorStockInfo.admin.controller");

router.get("/stock-information", adminAuth, getInvestorStockInfoAdmin);
router.post("/stock-information/left-cards", adminAuth, addLeftCard);
router.patch("/stock-information/left-cards/:cardId", adminAuth, updateLeftCard);
router.delete("/stock-information/left-cards/:cardId", adminAuth, deleteLeftCard);
router.post("/stock-information/info-items", adminAuth, addStockInfoItem);
router.patch(
  "/stock-information/info-items/:itemId",
  adminAuth,
  updateStockInfoItem
);
router.delete(
  "/stock-information/info-items/:itemId",
  adminAuth,
  deleteStockInfoItem
);

module.exports = router;
