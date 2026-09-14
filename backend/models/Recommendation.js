const mongoose = require("mongoose");

const recommendationSchema = new mongoose.Schema(
    {
        shipmentId: String,

        type: String,

        priority: Number,

        recommendation: String,

        reason: String,

        status: {
            type: String,
            default: "Pending"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Recommendation",
    recommendationSchema
);