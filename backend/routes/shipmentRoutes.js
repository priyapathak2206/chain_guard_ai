const express = require("express");

const {
    getShipments,
    getShipmentById
} = require("../controllers/shipmentController");

const router = express.Router();

router.get("/", getShipments);

router.get("/:id", getShipmentById);

module.exports = router;