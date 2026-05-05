const express = require("express");
const router = express.Router();

const adminAuth = require("../../middlewares/adminAuth.middleware");

const {
  getCareerAdmin,
  updateCareerHeader,
  addJob,
  updateJob,
  deleteJob,
  toggleJobStatus,
  updateApplicationProcess,
  addProcessStep,
  updateProcessStep,
  deleteProcessStep,
  updateFutureOpportunities,
} = require("../../controllers/admin/career.admin.controller");

router.get("/careers", adminAuth, getCareerAdmin);
router.patch("/careers/header", adminAuth, updateCareerHeader);
router.post("/careers/jobs", adminAuth, addJob);
router.patch("/careers/jobs/:jobId", adminAuth, updateJob);
router.delete("/careers/jobs/:jobId", adminAuth, deleteJob);
router.patch("/careers/jobs/:jobId/status", adminAuth, toggleJobStatus);
router.patch(
  "/careers/application-process",
  adminAuth,
  updateApplicationProcess
);
router.post(
  "/careers/application-process/steps",
  adminAuth,
  addProcessStep
);
router.patch(
  "/careers/application-process/steps/:stepId",
  adminAuth,
  updateProcessStep
);
router.delete(
  "/careers/application-process/steps/:stepId",
  adminAuth,
  deleteProcessStep
);
router.patch(
  "/careers/future-opportunities",
  adminAuth,
  updateFutureOpportunities
);

module.exports = router;
