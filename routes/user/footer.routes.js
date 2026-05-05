const express = require("express");
const router = express.Router();

const { getFooter } = require("../../controllers/footer.controller");

router.get("/", getFooter);

module.exports = router;
