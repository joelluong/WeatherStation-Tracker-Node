const prisma = require("../config/prisma");

class WeatherStation {
    static async findAll(filters = {}) {
        const where = {};

        if (filters.state) {
            where.state = filters.state.toUpperCase();
        }

        if (filters.portfolio) {
            where.portfolio = filters.portfolio;
        }

        return await prisma.weatherStation.findMany({
            where,
            orderBy: { id: "asc" },
        });
    }

    static async findById(id) {
        return await prisma.weatherStation.findUnique({
            where: { id: parseInt(id) },
        });
    }

    static async update(id, updateData) {
        const data = {};

        if (updateData.name) data.name = updateData.name;
        if (updateData.site) data.site = updateData.site;
        if (updateData.portfolio) data.portfolio = updateData.portfolio;
        if (updateData.state) data.state = updateData.state.toUpperCase();
        if (updateData.latitude !== undefined) data.latitude = updateData.latitude;
        if (updateData.longitude !== undefined) data.longitude = updateData.longitude;

        return await prisma.weatherStation.update({
            where: { id: parseInt(id) },
            data,
        });
    }

    static async bulkCreate(stations) {
        const results = {
            imported: 0,
            errors: [],
        };

        for (const station of stations) {
            try {
                await prisma.weatherStation.upsert({
                    where: { id: station.id },
                    update: {
                        name: station.name,
                        site: station.site,
                        portfolio: station.portfolio,
                        state: station.state.toUpperCase(),
                        latitude: station.latitude,
                        longitude: station.longitude,
                    },
                    create: {
                        id: station.id,
                        name: station.name,
                        site: station.site,
                        portfolio: station.portfolio,
                        state: station.state.toUpperCase(),
                        latitude: station.latitude,
                        longitude: station.longitude,
                    },
                });
                results.imported++;
            } catch (error) {
                results.errors.push({
                    station: station.name,
                    error: error.message,
                });
            }
        }

        return results;
    }
}

module.exports = WeatherStation;
