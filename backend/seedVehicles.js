const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Vehicle = require("./models/Vehicle");

dotenv.config();

const vehicles = [
    {
        vehicleId: "TR41",
        type: "Refrigerated Truck",
        location: "Ahmedabad",
        capacity: 5000,
        status: "Idle",
        refrigerated: true
    },

    {
        vehicleId: "TR20",
        type: "Cargo Truck",
        location: "Surat",
        capacity: 8000,
        status: "Active",
        refrigerated: false
    },

    {
        vehicleId: "TR25",
        type: "Cargo Truck",
        location: "Delhi",
        capacity: 7000,
        status: "Active",
        refrigerated: false
    },

    {
        vehicleId: "TR35",
        type: "Refrigerated Truck",
        location: "Mumbai",
        capacity: 5000,
        status: "Idle",
        refrigerated: true
    },

    {
        vehicleId: "TR50",
        type: "Cargo Truck",
        location: "Vadodara",
        capacity: 6000,
        status: "Maintenance",
        refrigerated: false
    }
];

const seedVehicles = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected");

        await Vehicle.deleteMany();

        await Vehicle.insertMany(vehicles);

        console.log("Vehicle data inserted successfully");

        process.exit(0);

    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedVehicles();