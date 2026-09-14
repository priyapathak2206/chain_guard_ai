const TemperatureLog = require("../models/TemperatureLog");
const Shipment = require("../models/Shipment");


// Get cold-chain shipments
const getColdChain = async (req, res) => {
    try {

        const shipments = await Shipment.find({
            coldChain: true
        });

        const result = [];

        for (const shipment of shipments) {

            const latestLog = await TemperatureLog
                .findOne({
                    shipmentId: shipment.shipmentId
                })
                .sort({ timestamp: -1 });

            result.push({
                shipmentId: shipment.shipmentId,
                cargoType: shipment.cargoType,
                requiredMin: shipment.temperatureMin,
                requiredMax: shipment.temperatureMax,
                currentTemperature: latestLog
                    ? latestLog.temperature
                    : null
            });
        }

        res.status(200).json(result);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// Get temperature history
const getTemperatureHistory = async (req, res) => {
    try {

        const logs = await TemperatureLog
            .find({
                shipmentId: req.params.shipmentId
            })
            .sort({ timestamp: 1 });

        res.status(200).json(logs);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


module.exports = {
    getColdChain,
    getTemperatureHistory
};