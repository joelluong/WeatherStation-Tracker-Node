const prisma = require("../config/prisma");

class MeasurementData {
    static async findByStation(stationId) {
        // First, get all weather data for this station
        const weatherData = await prisma.weatherData.findMany({
            where: {
                weatherStationId: parseInt(stationId),
            },
        });

        // Get all measurements for this station
        const measurements = await prisma.measurementData.findMany({
            where: {
                weatherStationId: parseInt(stationId),
            },
            orderBy: { timestamp: "desc" },
        });

        // Group measurements by weatherDataName and include weather data info
        const groupedData = measurements.reduce((weatherGroups, measurement) => {
            const name = measurement.weatherDataName;

            // Find existing group or create new one
            let existingGroup = weatherGroups.find((group) => group.name === name);

            if (!existingGroup) {
                let weatherInfo = weatherData.find((data) => data.name == name);

                if (!weatherInfo) {
                    weatherInfo = {
                        name: name,
                        longName: name,
                        unit: "unknown",
                    };
                }

                existingGroup = {
                    name: weatherInfo.name,
                    long_name: weatherInfo.longName,
                    unit: weatherInfo.unit,
                    measurement_data: [],
                };

                weatherGroups.push(existingGroup);
            }

            existingGroup.measurement_data.push({
                id: measurement.id,
                timestamp: measurement.timestamp,
                value: parseFloat(measurement.value),
                weather_station_id: measurement.weatherStationId,
            });

            return weatherGroups;
        }, []);

        return groupedData;
    }

    static async bulkCreate(measurements) {
        let imported = 0;
        let skipped = 0;
        const errors = [];

        for (const measurement of measurements) {
            try {
                // Round the value to 2 decimal places for comparison
                const roundedValue = Math.round(measurement.value * 100) / 100;

                // Check if measurement already exists with value comparison to 2 decimal places
                const existingRecords = await prisma.measurementData.findMany({
                    where: {
                        weatherStationId: measurement.weatherStationId,
                        weatherDataName: measurement.weatherDataName,
                        timestamp: new Date(measurement.timestamp),
                    },
                });

                // Check if any existing record has the same value when rounded to 2 decimal places
                const existing = existingRecords.some((record) => {
                    const existingRoundedValue = Math.round(parseFloat(record.value) * 100) / 100;
                    return existingRoundedValue === roundedValue;
                });

                if (existing) {
                    skipped++;
                    continue;
                }

                // Create new measurement only if it doesn't exist
                await prisma.measurementData.create({
                    data: {
                        weatherStationId: measurement.weatherStationId,
                        value: measurement.value,
                        weatherDataName: measurement.weatherDataName,
                        timestamp: new Date(measurement.timestamp),
                    },
                });

                imported++;
            } catch (error) {
                errors.push({
                    timestamp: measurement.timestamp,
                    error: error.message,
                });
            }
        }

        return { imported, skipped, errors };
    }
}

module.exports = MeasurementData;
