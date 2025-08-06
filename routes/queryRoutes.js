const express = require("express");
const { addQuery } = require("../controllers/queryController");
const router = express.Router();

router.post("/scrape/:query", addQuery);

module.exports = router;