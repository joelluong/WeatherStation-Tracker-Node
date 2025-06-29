const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");
const WeatherData = require("../models/weatherData");
const MeasurementData = require("../models/measurementData");

class MeasurementLoader {
    static async loadVariables(filePath = null) {
        const csvPath = filePath || path.join(__dirname, "..", "sample_data", "variables.csv");
        const variables = [];
        const errors = [];

        return new Promise((resolve, reject) => {
            fs.createReadStream(csvPath)
                .pipe(csv())
                .on("data", (row) => {
                    try {
                        variables.push({
                            var_id: parseInt(row.var_id),
                            weather_station_id: parseInt(row.id),
                            name: row.name,
                            unit: row.unit,
                            long_name: row.long_name,
                        });
                    } catch (error) {
                        errors.push(`Error processing row: ${error.message}`);
                    }
                })
                .on("end", async () => {
                    try {
                        const results = await WeatherData.bulkCreate(variables);
                        resolve({
                            imported: results.length,
                            errors,
                        });
                    } catch (error) {
                        reject(error);
                    }
                })
                .on("error", reject);
        });
    }

    static async loadMeasurementsForStation(stationId, filePath = null) {
        const csvPath = filePath || path.join(__dirname, "..", "sample_data", `data_${stationId}.csv`);

        const measurements = [];
        const errors = [];
        let headers = [];

        return new Promise((resolve, reject) => {
            fs.createReadStream(csvPath)
                .pipe(csv())
                .on("headers", (hdrs) => {
                    headers = hdrs;
                })
                .on("data", (row) => {
                    try {
                        // Parse timestamp
                        const [datePart, timePart] = row.timestamp.split(" ");
                        const [day, month, year] = datePart.split("/");
                        const timestamp = new Date(`${year}-${month}-${day} ${timePart}`);

                        // Process each column (except timestamp) as a separate measurement
                        headers.forEach((header) => {
                            if (header !== "timestamp" && row[header] !== undefined && row[header] !== "") {
                                const value = parseFloat(row[header]);
                                if (!isNaN(value)) {
                                    measurements.push({
                                        weatherStationId: stationId,
                                        value: value,
                                        weatherDataName: header,
                                        timestamp: timestamp,
                                    });
                                }
                            }
                        });
                    } catch (error) {
                        errors.push(`Error processing row: ${error.message}`);
                    }
                })
                .on("end", async () => {
                    try {
                        const result = await MeasurementData.bulkCreate(measurements);
                        resolve({
                            imported: result.imported,
                            skipped: result.skipped || 0,
                            errors: [...errors, ...result.errors],
                        });
                    } catch (error) {
                        reject(error);
                    }
                })
                .on("error", reject);
        });
    }

    static async loadAllMeasurements() {
        const results = {
            variables: { imported: 0, errors: [] },
            measurements: { imported: 0, skipped: 0, errors: [] },
        };

        try {
            results.variables = await this.loadVariables();

            for (let stationId = 1; stationId <= 10; stationId++) {
                try {
                    const stationResult = await this.loadMeasurementsForStation(stationId);

                    results.measurements.imported += stationResult.imported;
                    results.measurements.skipped += stationResult.skipped || 0;
                    results.measurements.errors.push(...stationResult.errors);
                } catch (error) {
                    results.measurements.errors.push({
                        station: stationId,
                        error: error.message,
                    });
                }
            }

            return results;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = MeasurementLoader;
