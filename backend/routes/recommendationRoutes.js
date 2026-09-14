const express = require("express");

const {
    getRecommendations,
    rerouteShipment,
    redeployVehicle
} = require("../controllers/recommendationController");

const router = express.Router();

router.get("/", getRecommendations);

router.post("/reroute", rerouteShipment);

router.post("/redeploy", redeployVehicle);

module.exports = router;