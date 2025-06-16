const express = require("express");
const dotenv = require("dotenv");
const swaggerUi = require("swagger-ui-express");
const prisma = require("./config/prisma");
const cors = require("cors");

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Test database connection
prisma
    .$connect()
    .then(() => {
        console.log("Successfully connected to database via Prisma");
    })
    .catch((err) => {
        console.error("Error connecting to the database:", err);
    });

// Import routes
const healthRoutes = require("./routes/health");
const weatherStationRoutes = require("./routes/weatherStations");
const measurementRoutes = require("./routes/measurements");

// Swagger Documentation
try {
    const swaggerDocument = require("./swagger-output.json");
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} catch (error) {
    console.log("Swagger documentation not generated yet. Run: npm run swagger-autogen");
}

// Use routes
app.use("/api/health", healthRoutes);
app.use("/api/weather-stations", weatherStationRoutes);
app.use("/api/measurements", measurementRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: "Internal Server Error",
        message: process.env.NODE_ENV === "development" ? err.message : "Something went wrong",
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: "Not Found",
        message: `Route ${req.originalUrl} not found`,
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`Documentation: http://localhost:${PORT}/api-docs`);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
    console.log("SIGTERM signal received: closing HTTP server");
    await prisma.$disconnect();
    console.log("Database connection closed");
    process.exit(0);
});
