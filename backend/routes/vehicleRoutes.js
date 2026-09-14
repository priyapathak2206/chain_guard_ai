const express = require("express");

const {
    getVehicles,
    getIdleVehicles
} = require("../controllers/vehicleController");

const router = express.Router();

router.get("/", getVehicles);

router.get("/idle", getIdleVehicles);

module.exports = router;