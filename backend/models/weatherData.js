const prisma = require("../config/prisma");

class WeatherData {
    static async findAll(filters = {}) {
        const where = {};

        if (filters.weather_station_id) {
            where.weatherStationId = filters.weather_station_id;
        }

        if (filters.name) {
            where.name = filters.name;
        }

        return await prisma.weatherData.findMany({
            where,
            orderBy: { varId: "asc" },
        });
    }

    static async findById(varId) {
        return await prisma.weatherData.findUnique({
            where: { varId: parseInt(varId) },
        });
    }

    static async findByStationId(stationId) {
        return await prisma.weatherData.findMany({
            where: { weatherStationId: parseInt(stationId) },
            orderBy: { varId: "asc" },
        });
    }

    static async bulkCreate(variables) {
        const results = [];
        const errors = [];

        for (const variable of variables) {
            try {
                const result = await prisma.weatherData.upsert({
                    where: { varId: variable.var_id },
                    update: {
                        weatherStationId: variable.weather_station_id,
                        name: variable.name,
                        unit: variable.unit,
                        longName: variable.long_name,
                    },
                    create: {
                        varId: variable.var_id,
                        weatherStationId: variable.weather_station_id,
                        name: variable.name,
                        unit: variable.unit,
                        longName: variable.long_name,
                    },
                });
                results.push(result);
            } catch (error) {
                errors.push({
                    variable,
                    error: error.message,
                });
            }
        }

        return results;
    }
}

module.exports = WeatherData;
