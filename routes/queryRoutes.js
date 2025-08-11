const express = require("express");
const { addQuery } = require("../controllers/queryController");
const { getProductByPrice } = require("../controllers/scrapeController");
const router = express.Router();

router.post("/scrape/:query", addQuery);
router.get("/productsByPrice", getProductByPrice);

module.exports = router;