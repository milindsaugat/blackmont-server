const express = require("express");
const router = express.Router();
const upload = require("../../middlewares/uploadInvestorEventFile.middleware");
const adminAuth = require("../../middlewares/adminAuth.middleware");
const {
  getInvestorEventsAdmin,
  getSingleInvestorEventAdmin,
  createInvestorEvent,
  updateInvestorEvent,
  deleteInvestorEvent,
  toggleInvestorEventPublished
} = require("../../controllers/admin/investorEvent.admin.controller");

router.use(adminAuth);

router.get("/events", getInvestorEventsAdmin);
router.get("/events/:id", getSingleInvestorEventAdmin);
router.post("/events", upload.single("eventFile"), createInvestorEvent);
router.patch("/events/:id", upload.single("eventFile"), updateInvestorEvent);
router.delete("/events/:id", deleteInvestorEvent);
router.patch("/events/:id/published", toggleInvestorEventPublished);

module.exports = router;
