const Recommendation =
    require("../models/Recommendation");


// Get recommendations
const getRecommendations = async (req, res) => {

    try {

        const recommendations =
            await Recommendation.find()
                .sort({ priority: 1 });

        res.status(200).json(recommendations);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};


// Reroute shipment
const rerouteShipment = async (req, res) => {

    try {

        const { shipmentId, routeId } = req.body;

        const recommendation =
            await Recommendation.create({
                shipmentId,
                type: "Reroute",
                priority: 1,
                recommendation:
                    `Reroute shipment to ${routeId}`,
                reason:
                    "Current route has increased disruption risk"
            });

        res.status(201).json(recommendation);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};


// Redeploy vehicle
const redeployVehicle = async (req, res) => {

    try {

        const {
            shipmentId,
            vehicleId
        } = req.body;

        const recommendation =
            await Recommendation.create({
                shipmentId,
                type: "Vehicle Redeployment",
                priority: 2,
                recommendation:
                    `Deploy vehicle ${vehicleId}`,
                reason:
                    "Vehicle is available for shipment"
            });

        res.status(201).json(recommendation);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};


module.exports = {
    getRecommendations,
    rerouteShipment,
    redeployVehicle
};