const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
    {
        vehicleId: {
            type: String,
            required: true,
            unique: true
        },

        type: {
            type: String,
            required: true
        },

        location: {
            type: String,
            required: true
        },

        capacity: {
            type: Number,
            required: true
        },

        status: {
            type: String,
            enum: ["Active", "Idle", "Maintenance"],
            required: true
        },

        refrigerated: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Vehicle", vehicleSchema);