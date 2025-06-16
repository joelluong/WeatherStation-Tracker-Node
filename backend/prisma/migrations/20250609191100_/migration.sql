-- CreateTable
CREATE TABLE `weather_stations` (
    `id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `site` VARCHAR(191) NOT NULL,
    `portfolio` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `latitude` DOUBLE NOT NULL,
    `longitude` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `weather_stations_name_key`(`name`),
    INDEX `weather_stations_state_idx`(`state`),
    INDEX `weather_stations_latitude_longitude_idx`(`latitude`, `longitude`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `weather_data` (
    `var_id` INTEGER NOT NULL,
    `weather_station_id` INTEGER NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `unit` VARCHAR(20) NOT NULL,
    `long_name` VARCHAR(100) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `weather_data_weather_station_id_idx`(`weather_station_id`),
    UNIQUE INDEX `weather_data_weather_station_id_name_key`(`weather_station_id`, `name`),
    PRIMARY KEY (`var_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `measurement_data` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `weather_station_id` INTEGER NOT NULL,
    `value` DECIMAL(10, 4) NOT NULL,
    `weather_data_name` VARCHAR(191) NOT NULL,
    `timestamp` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `measurement_data_weather_station_id_timestamp_idx`(`weather_station_id`, `timestamp` DESC),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `weather_data` ADD CONSTRAINT `weather_data_weather_station_id_fkey` FOREIGN KEY (`weather_station_id`) REFERENCES `weather_stations`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `measurement_data` ADD CONSTRAINT `measurement_data_weather_station_id_fkey` FOREIGN KEY (`weather_station_id`) REFERENCES `weather_stations`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
