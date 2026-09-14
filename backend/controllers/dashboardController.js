const Shipment = require("../models/Shipment");
const Vehicle = require("../models/Vehicle");
const Disruption = require("../models/Disruption");
const TemperatureLog = require("../models/TemperatureLog");

const getDashboard = async (req, res) => {

    try {

        // Shipment statistics
        const totalShipments = await Shipment.countDocuments();

        const criticalShipments =
            await Shipment.countDocuments({
                priority: "Critical"
            });

        const highShipments =
            await Shipment.countDocuments({
                priority: "High"
            });

        const mediumShipments =
            await Shipment.countDocuments({
                priority: "Medium"
            });

        const lowShipments =
            await Shipment.countDocuments({
                priority: "Low"
            });


        // Fleet statistics
        const totalVehicles =
            await Vehicle.countDocuments();

        const activeVehicles =
            await Vehicle.countDocuments({
                status: "Active"
            });

        const idleVehicles =
            await Vehicle.countDocuments({
                status: "Idle"
            });

        const maintenanceVehicles =
            await Vehicle.countDocuments({
                status: "Maintenance"
            });


        // Disruptions
        const activeDisruptions =
            await Disruption.countDocuments();


        // Cold chain
        const coldChainShipments =
            await Shipment.countDocuments({
                coldChain: true
            });


        res.status(200).json({

            shipments: {
                total: totalShipments,
                critical: criticalShipments,
                high: highShipments,
                medium: mediumShipments,
                low: lowShipments
            },

            fleet: {
                total: totalVehicles,
                active: activeVehicles,
                idle: idleVehicles,
                maintenance: maintenanceVehicles
            },

            disruptions: {
                active: activeDisruptions
            },

            coldChain: {
                monitored: coldChainShipments
            }

        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

module.exports = {
    getDashboard
};