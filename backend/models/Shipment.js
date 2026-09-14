const mongoose = require("mongoose");

const shipmentSchema = new mongoose.Schema(
    {
        shipmentId: {
            type: String,
            required: true,
            unique: true
        },

        origin: {
            type: String,
            required: true
        },

        destination: {
            type: String,
            required: true
        },

        cargoType: String,

        priority: {
            type: String,
            enum: ["Critical", "High", "Medium", "Low"]
        },

        carrierId: String,

        vehicleId: String,

        routeId: String,

        deadline: Date,

        coldChain: {
            type: Boolean,
            default: false
        },

        temperatureMin: Number,

        temperatureMax: Number,

        riskScore: {
            type: Number,
            default: 0
        },

        riskLevel: String,

        status: String
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Shipment", shipmentSchema);