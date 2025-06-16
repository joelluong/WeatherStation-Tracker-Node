import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import StationCard from "./StationCard";
import type { WeatherStation } from "../types/weatherStation";

interface StationListProps {
  stations: WeatherStation[];
  selectedStation: WeatherStation | null;
  filterState?: string;
  onStationClick: (station: WeatherStation) => void;
}

const StationList: React.FC<StationListProps> = ({
  stations,
  selectedStation,
  filterState,
  onStationClick,
}) => {
  const [filteredStations, setFilteredStations] = useState(stations);

  useEffect(() => {
    if (filterState) {
      console.log("🐧 ~ useEffect ~ filterState:", filterState);
      const filtered = stations.filter(
        (station) => station.state === filterState
      );
      setFilteredStations(filtered);
    } else {
      // Show all stations when no filter is applied
      setFilteredStations(stations);
    }
  }, [filterState, stations]);

  return (
    <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
      {filteredStations.map((station) => (
        <StationCard
          key={station.id}
          station={station}
          isSelected={selectedStation?.id === station.id}
          onClick={() => onStationClick(station)}
        />
      ))}
    </Box>
  );
};

export default StationList;
