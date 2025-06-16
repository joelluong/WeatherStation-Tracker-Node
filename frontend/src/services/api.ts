import axios from "axios";
import type {
  MeasurementGroup,
  WeatherVariable,
} from "../interface/measurement";
import type { WeatherStation } from "../types/weatherStation";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const API_BASE_URL = API_URL + "/api";

// Fetch all weather stations
export async function getWeatherStations(
  state?: string,
  portfolio?: string
): Promise<WeatherStation[]> {
  try {
    const response = await axios.get(`${API_BASE_URL}/weather-stations`, {
      params: { state, portfolio },
    });

    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching weather stations:", error);
    throw error;
  }
}

// Fetch single weather station by ID
export async function getWeatherStation(id: number): Promise<WeatherStation> {
  try {
    const response = await axios.get(`${API_BASE_URL}/weather-stations/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching weather station:", error);
    throw error;
  }
}

// Fetch measurements for a station
export async function getStationMeasurements(
  stationId: number
): Promise<MeasurementGroup[]> {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/measurements/station/${stationId}`
    );
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching station measurements:", error);
    throw error;
  }
}

// Fetch measurement variables
export async function getMeasurementVariables(
  weatherStationId?: number
): Promise<WeatherVariable[]> {
  try {
    const params = new URLSearchParams();
    if (weatherStationId)
      params.append("weather_station_id", weatherStationId.toString());

    const url = `${API_BASE_URL}/measurements/variables${
      params.toString() ? "?" + params.toString() : ""
    }`;
    const response = await axios.get(url);
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching measurement variables:", error);
    throw error;
  }
}
