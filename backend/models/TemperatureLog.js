const mongoose = require("mongoose");

const temperatureLogSchema = new mongoose.Schema(
    {
        shipmentId: {
            type: String,
            required: true
        },

        timestamp: {
            type: Date,
            required: true
        },

        temperature: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "TemperatureLog",
    temperatureLogSchema
);