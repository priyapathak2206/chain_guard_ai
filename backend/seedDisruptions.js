const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Disruption = require("./models/Disruption");

dotenv.config();

const disruptions = [
    {
        disruptionId: "D001",
        type: "Port Strike",
        location: "Mumbai Port",
        severity: "High",
        startTime: new Date("2026-09-14T08:00:00"),
        endTime: new Date("2026-09-17T08:00:00"),
        description: "Mumbai port strike affecting cargo movement."
    },

    {
        disruptionId: "D002",
        type: "Heavy Rainfall",
        location: "Surat",
        severity: "Medium",
        startTime: new Date("2026-09-14T10:00:00"),
        endTime: new Date("2026-09-15T18:00:00"),
        description: "Heavy rainfall causing transportation delays."
    },

    {
        disruptionId: "D003",
        type: "Road Closure",
        location: "NH48",
        severity: "High",
        startTime: new Date("2026-09-14T06:00:00"),
        endTime: new Date("2026-09-16T06:00:00"),
        description: "Road closure affecting the NH48 route."
    },

    {
        disruptionId: "D004",
        type: "Port Congestion",
        location: "Mundra",
        severity: "Medium",
        startTime: new Date("2026-09-14T09:00:00"),
        endTime: new Date("2026-09-16T09:00:00"),
        description: "High cargo volume causing port congestion."
    }
];

const seedDisruptions = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected");

        await Disruption.deleteMany();

        await Disruption.insertMany(disruptions);

        console.log("Disruption data inserted successfully");

        process.exit(0);

    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedDisruptions();