const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Shipment = require("./models/Shipment");

dotenv.config();

const shipments = [
    {
        shipmentId: "SH1024",
        origin: "Ahmedabad",
        destination: "Mumbai",
        cargoType: "Vaccines",
        priority: "Critical",
        carrierId: "C02",
        vehicleId: "TR41",
        routeId: "R12",
        deadline: new Date("2026-09-15"),
        coldChain: true,
        temperatureMin: 2,
        temperatureMax: 8,
        riskScore: 94,
        riskLevel: "CRITICAL",
        status: "Disrupted"
    },

    {
        shipmentId: "SH1025",
        origin: "Ahmedabad",
        destination: "Surat",
        cargoType: "Food",
        priority: "High",
        carrierId: "C01",
        vehicleId: "TR20",
        routeId: "R10",
        deadline: new Date("2026-09-16"),
        coldChain: true,
        temperatureMin: 2,
        temperatureMax: 8,
        riskScore: 72,
        riskLevel: "HIGH",
        status: "In Transit"
    },

    {
        shipmentId: "SH1026",
        origin: "Delhi",
        destination: "Mumbai",
        cargoType: "Electronics",
        priority: "Medium",
        carrierId: "C03",
        vehicleId: "TR25",
        routeId: "R15",
        deadline: new Date("2026-09-18"),
        coldChain: false,
        riskScore: 48,
        riskLevel: "MEDIUM",
        status: "In Transit"
    }
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected");

        await Shipment.deleteMany();

        await Shipment.insertMany(shipments);

        console.log("Shipment data inserted successfully");

        process.exit(0);

    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedDatabase();