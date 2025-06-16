import React from "react";
import {
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  type SelectChangeEvent,
  IconButton,
} from "@mui/material";
import { FilterAltOff } from "@mui/icons-material";

interface SearchFilterProps {
  selectedState: string;
  states: string[];
  setSelectedState: (data: any) => void;
  onStateChange: (event: SelectChangeEvent) => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  selectedState,
  states,
  setSelectedState,
  onStateChange,
}) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
      <FormControl fullWidth size="small">
        <InputLabel>State</InputLabel>
        <Select value={selectedState} onChange={onStateChange} label="State">
          {states.map((state) => (
            <MenuItem key={state} value={state}>
              {state}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <IconButton color="error" onClick={() => setSelectedState("")}>
        <FilterAltOff />
      </IconButton>
    </Box>
  );
};

export default SearchFilter;
