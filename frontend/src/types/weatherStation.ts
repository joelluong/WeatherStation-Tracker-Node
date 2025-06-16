export interface WeatherStation {
  id: number;
  name: string;
  site: string;
  portfolio: string;
  state: string;
  latitude: number;
  longitude: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}
