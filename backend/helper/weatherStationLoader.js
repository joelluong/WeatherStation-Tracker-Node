const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");
const WeatherStation = require("../models/weatherStation");

class WeatherStationLoader {
    static async loadFromCSV(filePath) {
        return new Promise((resolve, reject) => {
            const weatherStations = [];
            const errors = [];

            if (!fs.existsSync(filePath)) {
                reject(new Error(`CSV file not found: ${filePath}`));
                return;
            }

            fs.createReadStream(filePath)
                .pipe(csv())
                .on("data", (row) => {
                    try {
                        const weatherStation = {
                            id: parseInt(row.id),
                            name: row.ws_name,
                            site: row.site,
                            portfolio: row.portfolio,
                            state: row.state,
                            latitude: parseFloat(row.latitude),
                            longitude: parseFloat(row.longitude),
                        };

                        weatherStations.push(weatherStation);
                    } catch (error) {
                        errors.push(`Error processing row: ${error.message}`);
                    }
                })
                .on("end", async () => {
                    try {
                        const results = await WeatherStation.bulkCreate(weatherStations);
                        resolve({
                            success: true,
                            imported: results.imported,
                            skipped: weatherStations.length - results.imported,
                            errors: [...errors, ...results.errors],
                            data: results,
                        });
                    } catch (error) {
                        reject(error);
                    }
                })
                .on("error", (error) => {
                    reject(error);
                });
        });
    }

    static async loadSampleData() {
        const sampleDataPath = path.join(__dirname, "..", "sample_data", "weather_stations.csv");
        return this.loadFromCSV(sampleDataPath);
    }
}

module.exports = WeatherStationLoader;
