const Disruption = require("../models/Disruption");


// Get all disruptions
const getDisruptions = async (req, res) => {
    try {
        const disruptions = await Disruption.find();

        res.status(200).json(disruptions);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// Get disruption by ID
const getDisruptionById = async (req, res) => {
    try {
        const disruption = await Disruption.findOne({
            disruptionId: req.params.id
        });

        if (!disruption) {
            return res.status(404).json({
                message: "Disruption not found"
            });
        }

        res.status(200).json(disruption);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


module.exports = {
    getDisruptions,
    getDisruptionById
};