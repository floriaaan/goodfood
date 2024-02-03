import { Layer, Source } from "react-map-gl";

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

export const BOW_HEIGHT = 0.075;
export const Bow = ({ markerA, markerB }: BowProps) => {
  // Calculate the midpoint
  const midPoint = {
    latitude: (markerA.latitude + markerB.latitude) / 2,
    longitude: (markerA.longitude + markerB.longitude) / 2,
  };

  // Add or subtract from the latitude or longitude to create a curve
  midPoint.latitude += BOW_HEIGHT;

  // Generate the points along the Bézier curve
  const points = getBezierPoints(markerA, markerB, midPoint, 15);

  return (
    <Source
      type="geojson"
      data={{
        type: "LineString",
        coordinates: points.map((point) => [point.longitude, point.latitude]),
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
