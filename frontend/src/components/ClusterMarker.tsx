import React from "react";
import { Box } from "@mui/material";
import { LocationOn } from "@mui/icons-material";

interface ClusterMarkerProps {
  count: number;
  onClick?: () => void;
}

const ClusterMarker: React.FC<ClusterMarkerProps> = ({ count, onClick }) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        position: "relative",
        cursor: "pointer",
        display: "inline-flex",
      }}
    >
      <LocationOn
        sx={{
          fontSize: 40,
          color: "#f63b3b",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: -8,
          right: -8,
          minWidth: 20,
          height: 20,
          borderRadius: "50%",
          backgroundColor: "#ff5722",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 12,
          fontWeight: "bold",
          border: "2px solid white",
          boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
          px: count >= 10 ? 0.5 : 0,
        }}
      >
        {count}
      </Box>
    </Box>
  );
};

export default ClusterMarker;
