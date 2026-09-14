const mongoose = require("mongoose");

const disruptionSchema = new mongoose.Schema(
    {
        disruptionId: {
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

        severity: {
            type: String,
            enum: ["Low", "Medium", "High", "Critical"],
            required: true
        },

        startTime: Date,

        endTime: Date,

        description: String
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Disruption", disruptionSchema);