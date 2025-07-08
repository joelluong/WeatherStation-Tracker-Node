import type { WeatherStation } from "../types/weatherStation";

export interface Cluster {
  id: string;
  latitude: number;
  longitude: number;
  count: number;
  stations: WeatherStation[];
}

function lngLatToPixel(
  lng: number,
  lat: number,
  zoom: number
): { x: number; y: number } {
  const scale = (256 * Math.pow(2, zoom)) / (2 * Math.PI);
  const x = scale * (lng * (Math.PI / 180) + Math.PI);
  const y =
    scale * (Math.PI - Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360)));
  return { x, y };
}

function getPixelDistance(
  lng1: number,
  lat1: number,
  lng2: number,
  lat2: number,
  zoom: number
): number {
  const p1 = lngLatToPixel(lng1, lat1, zoom);
  const p2 = lngLatToPixel(lng2, lat2, zoom);
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

export function clusterMarkers(
  stations: WeatherStation[],
  zoom: number
): (WeatherStation | Cluster)[] {
  if (zoom >= 7) {
    return stations;
  }

  // Dynamic cluster radius based on zoom level
  let clusterRadius: number;
  switch (true) {
    case zoom >= 6:
      clusterRadius = 30;
      break;
    case zoom >= 5:
      clusterRadius = 20;
      break;
    case zoom >= 4:
      clusterRadius = 15;
      break;
    default:
      clusterRadius = 10; // for zoom 3 and below
      break;
  }

  const clustered = new Set<number>();
  const result: (WeatherStation | Cluster)[] = [];

  for (let i = 0; i < stations.length; i++) {
    if (clustered.has(i)) continue;

    const station = stations[i];
    const cluster: Cluster = {
      id: `cluster-${i}`,
      latitude: station.latitude,
      longitude: station.longitude,
      count: 1,
      stations: [station],
    };

    // Mark this station as part of a cluster immediately
    clustered.add(i);

    for (let j = i + 1; j < stations.length; j++) {
      if (clustered.has(j)) continue;

      const otherStation = stations[j];
      const distance = getPixelDistance(
        cluster.longitude,
        cluster.latitude,
        otherStation.longitude,
        otherStation.latitude,
        zoom
      );

      if (distance < clusterRadius) {
        cluster.stations.push(otherStation);
        cluster.count++;
        clustered.add(j);

        // Update cluster center as we add stations
        const sumLat = cluster.stations.reduce((sum, s) => sum + s.latitude, 0);
        const sumLng = cluster.stations.reduce(
          (sum, s) => sum + s.longitude,
          0
        );
        cluster.latitude = sumLat / cluster.count;
        cluster.longitude = sumLng / cluster.count;
      }
    }

    if (cluster.count > 1) {
      result.push(cluster);
    } else {
      // If it's just one station, add it as individual marker
      result.push(station);
    }
  }

  return result;
}

export function isCluster(item: WeatherStation | Cluster): item is Cluster {
  return "count" in item && "stations" in item;
}
