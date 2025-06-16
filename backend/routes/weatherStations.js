const express = require("express");
const router = express.Router();
const WeatherStation = require("../models/weatherStation");

// GET /api/weather-stations - Get all weather stations
router.get("/", async (req, res) => {
    // #swagger.tags = ['Weather Stations']
    // #swagger.summary = 'Get all weather stations'
    // #swagger.parameters['state'] = { in: 'query', description: 'Filter by state' }
    // #swagger.parameters['portfolio'] = { in: 'query', description: 'Filter by portfolio' }
    try {
        const { state, portfolio } = req.query;
        const filters = {};

        if (state) filters.state = state.toUpperCase();
        if (portfolio) filters.portfolio = portfolio;

        const weatherStations = await WeatherStation.findAll(filters);

        res.json({
            success: true,
            count: weatherStations.length,
            data: weatherStations,
        });
    } catch (error) {
        console.error("Error fetching weather stations:", error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch weather stations",
            message: error.message,
        });
    }
});

// GET /api/weather-stations/:id - Get weather station by ID
router.get("/:id", async (req, res) => {
    // #swagger.tags = ['Weather Stations']
    // #swagger.summary = 'Get weather station by ID'
    try {
        const { id } = req.params;
        const weatherStation = await WeatherStation.findById(id);

        if (!weatherStation) {
            return res.status(404).json({
                success: false,
                error: "Weather station not found",
            });
        }

        res.json({
            success: true,
            data: weatherStation,
        });
    } catch (error) {
        console.error("Error fetching weather station:", error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch weather station",
            message: error.message,
        });
    }
});

module.exports = router;
