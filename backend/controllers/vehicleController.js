const Vehicle = require("../models/Vehicle");

// Get all vehicles
const getVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.find();

        res.status(200).json(vehicles);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// Get idle vehicles
const getIdleVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.find({
            status: "Idle"
        });

        res.status(200).json(vehicles);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


module.exports = {
    getVehicles,
    getIdleVehicles
};