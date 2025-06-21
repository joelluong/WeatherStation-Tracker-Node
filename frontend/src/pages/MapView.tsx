import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Paper,
  Typography,
  Divider,
  Button,
  type SelectChangeEvent,
} from "@mui/material";
import SearchFilter from "../components/SearchFilter";
import StationList from "../components/StationList";
import MeasurementsDialog from "../components/MeasurementsDialog";
import type { WeatherStation } from "../types/weatherStation";
import { getWeatherStations } from "../services/api";
import ReactMapGL, {
  Marker,
  Popup,
  type MapRef,
  type MarkerEvent,
  type ViewState,
} from "react-map-gl/mapbox";
import { HourglassEmpty, LocationOn } from "@mui/icons-material";

const MapView: React.FC = () => {
  const mapRef = useRef<MapRef>(null);

  const [selectedStation, setSelectedStation] = useState<WeatherStation | null>(
    null
  );
  const [showMeasurement, setShowMeasurement] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [states, setState] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState<string>("");
  const [weatherStations, setWeatherStations] = useState<WeatherStation[]>([]);
  const [viewport, setViewport] = useState<ViewState>({
    latitude: -25.2744, // Center of Australia
    longitude: 133.7751,
    zoom: 4,
    bearing: 0,
    pitch: 0,
    padding: { top: 0, bottom: 0, left: 0, right: 0 },
  });

  const handleStationClick = (station: WeatherStation) => {
    setSelectedStation(station);
    setShowPin(true);
  };

  const handleStateChange = (event: SelectChangeEvent) => {
    setSelectedState(event.target.value);
  };

  const onMarkerClick = (
    event: MarkerEvent<MouseEvent>,
    station: WeatherStation
  ) => {
    event.originalEvent.stopPropagation();
    setSelectedStation(station);
    setShowPin(true);
  };

  useEffect(() => {
    async function getListStations() {
      try {
        const stations = await getWeatherStations();

        setWeatherStations(stations);
        setState([...new Set(stations.map((s) => s.state))]);
      } finally {
        setIsLoading(false);
      }
    }

    getListStations();
  }, []);

  useEffect(() => {
    if (selectedStation) {
      mapRef.current?.flyTo({
        center: [selectedStation.longitude, selectedStation.latitude],
        zoom: 12,
        duration: 2000, // Animation duration in milliseconds
      });
    }
  }, [selectedStation]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[100vh]">
        <HourglassEmpty className="animate-spin" />
        <p className="ml-2 text-2xl">Loading ...</p>
      </div>
    );
  }

  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "grey.50" }}>
      {/* Left Sidebar */}
      <Paper
        elevation={0}
        sx={{
          width: 320,
          height: "100%",
          borderRadius: 0,
          borderRight: 1,
          borderColor: "divider",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Box sx={{ p: 3, bgcolor: "white" }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom mb={2}>
            Weather Stations
          </Typography>

          <SearchFilter
            selectedState={selectedState}
            states={states}
            setSelectedState={setSelectedState}
            onStateChange={handleStateChange}
          />
        </Box>

        <Divider />

        <StationList
          stations={weatherStations}
          selectedStation={selectedStation}
          filterState={selectedState}
          onStationClick={handleStationClick}
        />
      </Paper>

      {/* Map Area */}
      <Box sx={{ flex: 1, position: "relative", overflow: "hidden" }}>
        {/* Map Container */}
        <ReactMapGL
          {...viewport}
          ref={mapRef}
          mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
          mapStyle="mapbox://styles/mapbox/streets-v11"
          style={{ width: "100%", height: "100vh" }}
          onMove={(evt) => setViewport(evt.viewState)}
        >
          {weatherStations.map((station) => (
            <Marker
              latitude={station.latitude}
              longitude={station.longitude}
              anchor="bottom"
              onClick={(e) => onMarkerClick(e, station)}
            >
              <LocationOn
                sx={{
                  fontSize: 40,
                  color: "#f63b3b",
                }}
              />
            </Marker>
          ))}

          {showPin && selectedStation && (
            <Popup
              anchor="top"
              longitude={Number(selectedStation.longitude)}
              latitude={Number(selectedStation.latitude)}
              onClose={() => setShowPin(false)}
              closeOnClick={false}
              maxWidth="300px"
            >
              <Box sx={{ minWidth: 200 }}>
                <Box sx={{ px: 2, pt: 2, pb: 1 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {selectedStation.name}
                  </Typography>
                </Box>
                <Divider />
                <Box sx={{ p: 2 }}>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}
                  >
                    <Typography variant="body2">
                      <strong>Site:</strong> {selectedStation.site}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Portfolio:</strong> {selectedStation.portfolio}
                    </Typography>
                    <Typography variant="body2">
                      <strong>State:</strong> {selectedStation.state}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Latitude:</strong>{" "}
                      {selectedStation.latitude.toFixed(4)}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Longitude:</strong>{" "}
                      {selectedStation.longitude.toFixed(4)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{ mt: 2, display: "flex", justifyContent: "center" }}
                  >
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => {
                        setShowMeasurement(true);
                      }}
                    >
                      See details
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Popup>
          )}
        </ReactMapGL>
      </Box>

      <MeasurementsDialog
        open={showMeasurement}
        onClose={() => setShowMeasurement(false)}
        station={selectedStation}
      />
    </Box>
  );
};

export default MapView;
