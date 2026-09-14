const mongoose = require("mongoose");
const dotenv = require("dotenv");

const TemperatureLog = require("./models/TemperatureLog");

dotenv.config();

const temperatureLogs = [
    {
        shipmentId: "SH1024",
        timestamp: new Date("2026-09-14T10:00:00"),
        temperature: 4.2
    },

    {
        shipmentId: "SH1024",
        timestamp: new Date("2026-09-14T11:00:00"),
        temperature: 4.5
    },

    {
        shipmentId: "SH1024",
        timestamp: new Date("2026-09-14T12:00:00"),
        temperature: 5.1
    },

    {
        shipmentId: "SH1024",
        timestamp: new Date("2026-09-14T13:00:00"),
        temperature: 5.4
    },

    {
        shipmentId: "SH1024",
        timestamp: new Date("2026-09-14T14:00:00"),
        temperature: 9.2
    },

    {
        shipmentId: "SH1024",
        timestamp: new Date("2026-09-14T14:20:00"),
        temperature: 9.7
    },

    {
        shipmentId: "SH1024",
        timestamp: new Date("2026-09-14T15:00:00"),
        temperature: 5.8
    }
];

const seedTemperature = async () => {
    try {

        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected");

        await TemperatureLog.deleteMany();

        await TemperatureLog.insertMany(temperatureLogs);

        console.log("Temperature data inserted successfully");

        process.exit(0);

    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedTemperature();