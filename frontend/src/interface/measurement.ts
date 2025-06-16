export interface MeasurementData {
  id: number;
  timestamp: string;
  value: number;
  weather_station_id: number;
}

export interface MeasurementGroup {
  name: string;
  long_name: string;
  unit: string;
  measurement_data: MeasurementData[];
}

export interface WeatherVariable {
  name: string;
  longName: string;
  unit: string;
  varId: string;
  weatherStationId: number;
}

interface WeatherParameter {
  name: string;
  long_name: string;
  unit: string;
  measurement_data: MeasurementData[];
}

// Main weather data structure
interface WeatherData {
  [parameterName: string]: WeatherParameter;
}

// Example usage with your specific data:
interface SpecificWeatherData {
  AirT_inst: WeatherParameter;
  GHI_inst: WeatherParameter;
}
