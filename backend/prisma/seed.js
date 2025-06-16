const { PrismaClient } = require("@prisma/client");
const WeatherStationLoader = require("../helper/weatherStationLoader");
const MeasurementLoader = require("../helper/measurementLoader");

const prisma = new PrismaClient();

async function main() {
    console.log("Starting database seeding...");

    try {
        // Import weather stations
        console.log("Importing weather stations...");
        const weatherStationResult = await WeatherStationLoader.loadSampleData();
        console.log(`✓ Imported ${weatherStationResult.imported} weather stations`);

        if (weatherStationResult.errors.length > 0) {
            console.warn("Weather station import errors:", weatherStationResult.errors);
        }

        // Import all measurement data
        console.log("Importing measurement data...");
        const measurementResult = await MeasurementLoader.loadAllMeasurements();
        console.log(`✓ Imported ${measurementResult.variables.imported} measurement variables`);
        console.log(`✓ Imported ${measurementResult.measurements.imported} measurements`);

        if (measurementResult.variables.errors.length > 0) {
            console.warn("Measurement variables import errors:", measurementResult.variables.errors);
        }
        if (measurementResult.measurements.errors.length > 0) {
            console.warn("Measurements import errors:", measurementResult.measurements.errors);
        }

        console.log("✅ Database seeding completed successfully!");
    } catch (error) {
        console.error("❌ Error during database seeding:", error);
        throw error;
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
