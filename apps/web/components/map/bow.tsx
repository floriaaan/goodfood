import { useEffect, useState } from "react";
import { Layer, Source } from "@/components/map/gl";
import { calculateDistance } from "@/components/map/distance";
import { getDirections } from "@/lib/fetchers/externals/mapbox";

type Marker = {
  latitude: number;
  longitude: number;
};

type BowProps = {
  markerA: Marker;
  markerB: Marker;
};

function getBezierPoints(markerA: Marker, markerB: Marker, midPoint: Marker, numPoints: number): Marker[] {
  const points = [];
  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;
    const latitude =
      Math.pow(1 - t, 2) * markerA.latitude + 2 * (1 - t) * t * midPoint.latitude + t * t * markerB.latitude;
    const longitude =
      Math.pow(1 - t, 2) * markerA.longitude + 2 * (1 - t) * t * midPoint.longitude + t * t * markerB.longitude;
    points.push({ latitude, longitude });
  }
  return points;
}

// Used while the real route is loading, and as a fallback if the routing API errors out (no
// network, rate-limited demo server, etc.): an arced line between the two points instead of
// nothing on screen.
function getBezierCoordinates(markerA: Marker, markerB: Marker): [number, number][] {
  const midPoint = {
    latitude: (markerA.latitude + markerB.latitude) / 2,
    longitude: (markerA.longitude + markerB.longitude) / 2,
  };
  midPoint.latitude += getBowHeight({ markerA, markerB });
  return getBezierPoints(markerA, markerB, midPoint, 15).map((point) => [point.longitude, point.latitude]);
}

export const Bow = ({ markerA, markerB }: BowProps) => {
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][] | null>(null);

  useEffect(() => {
    let cancelled = false;
    // Clear the previous route immediately so a stale path between the old markers isn't shown
    // while the new one is loading; the bezier fallback below covers the gap until it resolves.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRouteCoordinates(null);
    (async () => {
      const directions = await getDirections(
        { lat: markerA.latitude, lng: markerA.longitude },
        { lat: markerB.latitude, lng: markerB.longitude },
      );
      const coordinates = directions?.routes?.[0]?.geometry?.coordinates as [number, number][] | undefined;
      if (!cancelled && coordinates?.length) setRouteCoordinates(coordinates);
    })();
    return () => {
      cancelled = true;
    };
  }, [markerA.latitude, markerA.longitude, markerB.latitude, markerB.longitude]);

  const coordinates = routeCoordinates ?? getBezierCoordinates(markerA, markerB);

  return (
    <Source
      type="geojson"
      data={{
        type: "LineString",
        coordinates,
      }}
    >
      <Layer
        id="line-layer"
        type="line"
        paint={{
          "line-color": "black",
          "line-width": 4,
        }}
      />
    </Source>
  );
};
export const BOW_HEIGHT = 0.075;

const getBowHeight = ({ markerA, markerB }: BowProps): number => {
  const distance = calculateDistance(markerA.latitude, markerA.longitude, markerB.latitude, markerB.longitude);
  switch (true) {
    case distance < 1000:
      return BOW_HEIGHT / 10;
    case distance < 5000:
      return BOW_HEIGHT / 5;
    case distance < 10000:
      return BOW_HEIGHT;
    default:
      return BOW_HEIGHT * 3;
  }
};
