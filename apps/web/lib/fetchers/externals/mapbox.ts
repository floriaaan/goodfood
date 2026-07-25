import { Result } from "@/types/externals/mapbox";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

// OSRM's public demo server (https://project-osrm.org/) is a free, no-signup routing API. It
// doesn't return the same rich response as Mapbox's Directions API (no step-by-step instructions,
// admin boundaries, etc.), but it does return routes[0].duration and, with overview=full, the
// actual road geometry that callers here read.
const getDirectionsFromOsrm = async (
  pointA: { lat: number; lng: number },
  pointB: { lat: number; lng: number },
): Promise<Result> => {
  const response = await fetch(
    `https://router.project-osrm.org/route/v1/driving/${pointA.lng},${pointA.lat};${pointB.lng},${pointB.lat}?overview=full&geometries=geojson`,
  );
  const res = await response.json();
  return res as Result;
};

export const getDirections = async (
  pointA: {
    lat: number;
    lng: number;
  },
  pointB: {
    lat: number;
    lng: number;
  },
) => {
  if (!MAPBOX_TOKEN) return getDirectionsFromOsrm(pointA, pointB);

  const response = await fetch(
    `https://api.mapbox.com/directions/v5/mapbox/driving/${pointA.lng},${pointA.lat};${pointB.lng},${pointB.lat}?geometries=geojson&overview=full&access_token=${MAPBOX_TOKEN}`,
  );

  const res = await response.json();
  return res as Result;
};
