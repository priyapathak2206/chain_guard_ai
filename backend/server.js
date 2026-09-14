const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const shipmentRoutes = require("./routes/shipmentRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const disruptionRoutes = require("./routes/disruptionRoutes");
const coldChainRoutes = require("./routes/coldChainRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const recommendationRoutes =
    require("./routes/recommendationRoutes");


dotenv.config();

const app = express();


// Connect MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
    res.json({
        message: "ChainGuard AI Backend is running"
    });
});

app.use("/api/shipments", shipmentRoutes);
app.use("/api/fleet", vehicleRoutes);
app.use("/api/disruptions", disruptionRoutes);
app.use("/api/cold-chain", coldChainRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use(
    "/api/recommendations",
    recommendationRoutes
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});