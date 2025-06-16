import React from "react";
import { Card, CardContent, Box, Chip } from "@mui/material";
import type { WeatherStation } from "../types/weatherStation";

interface StationCardProps {
  station: WeatherStation;
  isSelected?: boolean;
  onClick?: () => void;
}

const StationCard: React.FC<StationCardProps> = ({
  station,
  isSelected = false,
  onClick,
}) => {
  return (
    <Card
      onClick={onClick}
      sx={{
        mb: 2,
        cursor: "pointer",
        backgroundColor: isSelected ? "primary.light" : "background.paper",
        border: isSelected ? "2px solid" : "1px solid",
        borderColor: isSelected ? "primary.main" : "divider",
        "&:hover": {
          backgroundColor: isSelected ? "primary.light" : "action.hover",
          borderColor: isSelected ? "primary.main" : "action.selected",
        },
        transition: "all 0.2s ease",
      }}
    >
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Box flex={1}>
            <div className="text-lg">{station.name}</div>
            <div className="text-sm ">
              <span className="font-bold">Site:</span> {station.site}
            </div>
            <div className="text-sm">
              <span className="font-bold">Portfolio:</span> {station.portfolio}
            </div>
          </Box>
          <Chip
            label={station.state}
            color="primary"
            size="small"
            sx={{ ml: 1 }}
          />
        </Box>
        {/* <Button>View on map</Button> */}

        {/* <Box display="flex" gap={2} mt={2}>
          <Box display="flex" alignItems="center" gap={0.5}>
            <Thermostat fontSize="small" sx={{ color: "warning.main" }} />
            <Typography variant="body2">
              {station.temperature !== undefined
                ? `${station.temperature}°C`
                : "--°C"}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={0.5}>
            <Water fontSize="small" sx={{ color: "primary.main" }} />
            <Typography variant="body2">
              {station.humidity !== undefined ? `${station.humidity}%` : "--%"}
            </Typography>
          </Box>
        </Box> */}
      </CardContent>
    </Card>
  );
};

export default StationCard;
