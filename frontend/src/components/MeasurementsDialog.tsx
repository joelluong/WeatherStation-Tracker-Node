import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Divider,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import type { WeatherStation } from "../types/weatherStation";
import type { MeasurementGroup } from "../interface/measurement";
import { getStationMeasurements } from "../services/api";

interface StationDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  station: WeatherStation | null;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`measurement-tabpanel-${index}`}
      aria-labelledby={`measurement-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const MeasurementsDialog: React.FC<StationDetailsDialogProps> = ({
  open,
  onClose,
  station,
}) => {
  const [measurements, setMeasurements] = useState<MeasurementGroup[]>();
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    if (open && station) {
      fetchMeasurements();
    }
  }, [open, station]);

  const fetchMeasurements = async () => {
    if (!station) return;

    setLoading(true);

    try {
      const data = await getStationMeasurements(station.id);
      setMeasurements(data);
      setTabValue(0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!station) return null;

  // const measurementKeys = Object.keys(measurements);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h6">{station.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {station.site} • {station.portfolio} • {station.state}
            </Typography>
          </Box>
          <IconButton onClick={onClose} edge="end">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        {loading && (
          <Box display="flex" justifyContent="center" py={5}>
            <CircularProgress />
          </Box>
        )}

        {!loading && measurements && (
          <>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="measurement tabs"
              >
                {measurements.map((data, index) => (
                  <Tab
                    key={data.name}
                    label={
                      <Box textAlign="center">
                        <Typography variant="body2">
                          {data.long_name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {data.unit}
                        </Typography>
                      </Box>
                    }
                    id={`measurement-tab-${index}`}
                    aria-controls={`measurement-tabpanel-${index}`}
                  />
                ))}
              </Tabs>
            </Box>

            {measurements.map((table_data, index) => {
              const measurement = table_data.measurement_data;
              return (
                <TabPanel key={table_data.name} value={tabValue} index={index}>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      {table_data.long_name} ({table_data.unit})
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Variable: {table_data.name}
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    {measurement.length > 0 ? (
                      <TableContainer component={Paper} variant="outlined">
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Timestamp</TableCell>
                              <TableCell align="right">Value</TableCell>
                              <TableCell align="right">Unit</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {measurement.map((row_data) => (
                              <TableRow key={row_data.id}>
                                <TableCell>
                                  {formatDate(row_data.timestamp)}
                                </TableCell>
                                <TableCell align="right">
                                  {row_data.value.toFixed(2)}
                                </TableCell>
                                <TableCell align="right">
                                  {table_data.unit}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    ) : (
                      <Alert severity="info">
                        No data points available for this measurement.
                      </Alert>
                    )}
                  </Box>
                </TabPanel>
              );
            })}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MeasurementsDialog;
