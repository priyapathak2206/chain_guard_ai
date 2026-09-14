const express = require("express");

const {
    getColdChain,
    getTemperatureHistory
} = require("../controllers/coldChainController");

const router = express.Router();

router.get("/", getColdChain);

router.get("/:shipmentId", getTemperatureHistory);

module.exports = router;