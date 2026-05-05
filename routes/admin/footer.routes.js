const express = require("express");
const router = express.Router();

const adminAuth = require("../../middlewares/adminAuth.middleware");

const { getFooter, updateSocialLinks } = require("../../controllers/admin/footer.admin.controller");

router.get("/", adminAuth, getFooter);
router.patch("/social-links", adminAuth, updateSocialLinks);

module.exports = router;
