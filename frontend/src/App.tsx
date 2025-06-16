import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import MapView from "./pages/MapView";
import "mapbox-gl/dist/mapbox-gl.css";

const theme = createTheme({
  palette: {
    primary: {
      main: "#3B82F6",
    },
    secondary: {
      main: "#10B981",
    },
    background: {
      default: "#F9FAFB",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MapView />
    </ThemeProvider>
  );
}

export default App;
