const express = require("express");
const router = express.Router();
const { scrapeProduct, home } = require("../controllers/scrapeController");

router.get("/", home);
router.get("/scrape/:product", scrapeProduct);

module.exports = router;
