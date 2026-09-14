const Shipment = require("../models/Shipment");

const getShipments = async (req, res) => {
    try {
        const shipments = await Shipment.find();

        res.status(200).json(shipments);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getShipmentById = async (req, res) => {
    try {
        const shipment = await Shipment.findOne({
            shipmentId: req.params.id
        });

        if (!shipment) {
            return res.status(404).json({
                message: "Shipment not found"
            });
        }

        res.status(200).json(shipment);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    getShipments,
    getShipmentById
};