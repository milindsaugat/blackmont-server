const express = require("express");
const router = express.Router();
const adminAuth = require("../../middlewares/adminAuth.middleware");
const {
  getGovernanceAdmin,
  updateGovernanceAdmin,
  addPillar,
  updatePillar,
  deletePillar
} = require("../../controllers/admin/corporateGovernance.admin.controller");

router.use(adminAuth);

router.get("/corporate-governance", getGovernanceAdmin);
router.patch("/corporate-governance", updateGovernanceAdmin);

router.post("/corporate-governance/pillars", addPillar);
router.patch("/corporate-governance/pillars/:pillarId", updatePillar);
router.delete("/corporate-governance/pillars/:pillarId", deletePillar);

module.exports = router;
