import { Result } from "@/types/externals/mapbox";

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
  const response = await fetch(
    `https://api.mapbox.com/directions/v5/mapbox/driving/${pointA.lng},${pointA.lat};${pointB.lng},${pointB.lat}?access_token=${process.env.EXPO_PUBLIC_MAPBOX_TOKEN}`,
  );

  const res = await response.json();
  return res as Result;
};
