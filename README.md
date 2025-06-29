# PROA Coding Challenge Solution with Node JS and React

**Time Spent**: 10 hours

## Project Description

This project displays weather stations as markers on a map using a Node.js and a React TypeScript frontend. Users can view detailed information about each weather station by interacting with the map markers.

### Results:
1. **Weather Stations Displayed as Markers on Google Maps**  
   ![image](https://github.com/user-attachments/assets/e431ac4a-ba93-40e9-968b-0fe1c9ef7715)

2. **Detailed Weather Station Dialog**: Displays full details of a selected weather station.

   A. **Chart View**
   ![image](https://github.com/user-attachments/assets/156f1e0a-1644-41d1-8448-e4bc284f87c2)

   B. **Table View**  
   ![image](https://github.com/user-attachments/assets/4ecb5279-f30b-4a96-9b83-e75ad0a43afe)

---

## Implementation Details

### 1. API

**Technologies**:
- Node.js 22.12.0
- Express.js
- Prisma ORM
- `csv-parser` (for reading and processing CSV files)
- MySQL database

The API reads data from CSV files and seeds it into a MySQL database. It exposes endpoints for retrieving weather station data used by the frontend.

---

### 2. Client
**Technologies**:
- React with TypeScript (Vite template)
- Mapbox GL JS (for map rendering)
- Material UI (for UI components)

The client fetches data from the API and renders it as markers on a Mapbox-powered map. Clicking a marker reveals detailed station information.

---

## How to Run the Project

### API Setup

1. Ensure Node.js 22.12.0 or later is installed on your machine.
2. Install MySQL locally. You can use **DBngin** for installation and **DBeaver** to manage and access the database. If the database is not created successfully, try connecting to MySQL manually via Terminal and create it yourself:
   ```bash
   mysql -h 127.0.0.1 -P 3306 -u root -p
   SHOW DATABASES;
   CREATE DATABASE proadb;
3. Navigate to the `/backend` folder.
4. Run the following commands to install dependencies and seed data from the CSV files into the MySQL database:
   ```bash
   npm install
   npm run db:migrate
   npm run db:seed
   
4. Start the development server:
   ```bash
   npm run dev

### Client Setup
1. Navigate to the `/frontend` folder.
2. Install dependencies:
   ```bash
   npm install

3. Start the Vite development server:
   ```bash
   npm run dev

### Known or Suspected Bugs
1. **Incorrect location of Parkes East**
   ![image4](https://github.com/user-attachments/assets/6a6b0f49-6893-493a-ba53-541c45677455)

   The coordinates listed for Parkes East (33.110485, 148.101728) incorrectly place it near the Sea of Japan, which is clearly not accurate.
   ![image5](https://github.com/user-attachments/assets/26cb2faf-080c-4d3f-92f1-be2a70d0b7c3)

   To correct this, I believe the latitude should be negative. I’ve manually updated the database to use -33.110485, which aligns with a location to the east of Parkes, as expected. Interestingly, based on Google Maps, this location may correspond to the **Goonumbla Solar Farm** — a photovoltaic power plant — as referenced here: [Goonumbla Solar Farm - Google Maps](https://maps.app.goo.gl/jUP3AJE5mnkKmvck7)

2. **Unknown measurement unit for Bungala 1 West**
   
   The variable names used in `variables.csv` (which is `AirT_inst` and `GHI_inst`) do not match the ones used in `data_2.csv` (which is `avg_Wm2`, `avg_airTemp`).
   
   ![image](https://github.com/user-attachments/assets/9886ba7d-20de-4b9a-a9c1-44c2cd5e7ff8)

   I recommend resolving this inconsistency by updating the column names in `data_2.csv` to match those in `variables.csv`. After that, re-running the database seed should correctly align the data and fix the unit mapping issue.
