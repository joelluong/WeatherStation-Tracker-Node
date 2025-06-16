const express = require("express");
const router = express.Router();
const MeasurementData = require("../models/measurementData");
const WeatherData = require("../models/weatherData");

// GET /api/measurements/station/:stationId - Get all measurements for a station grouped by name
router.get("/station/:stationId", async (req, res) => {
    // #swagger.tags = ['Measurements']
    // #swagger.summary = 'Get all measurements for a weather station grouped by measurement name'
    try {
        const { stationId } = req.params;

        const groupedMeasurements = await MeasurementData.findByStation(parseInt(stationId));

        // Calculate total count across all groups
        const totalCount = Object.values(groupedMeasurements).reduce(
            (sum, group) => sum + group.measurement_data.length,
            0
        );

        res.json({
            success: true,
            count: totalCount,
            groups: Object.keys(groupedMeasurements).length,
            data: groupedMeasurements,
        });
    } catch (error) {
        console.error("Error fetching all measurements:", error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch all measurements",
            message: error.message,
        });
    }
});

// GET /api/measurements/variables - Get all measurement variables
router.get("/variables", async (req, res) => {
    // #swagger.tags = ['Measurements']
    // #swagger.summary = 'Get all measurement variables'
    try {
        const { weather_station_id } = req.query;
        const filters = {};

        if (weather_station_id) filters.weather_station_id = parseInt(weather_station_id);

        const variables = await WeatherData.findAll(filters);

        res.json({
            success: true,
            count: variables.length,
            data: variables,
        });
    } catch (error) {
        console.error("Error fetching measurement variables:", error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch measurement variables",
            message: error.message,
        });
    }
});

module.exports = router;
