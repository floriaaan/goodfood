"use client";

import "mapbox-gl/dist/mapbox-gl.css";

// todo: make private token
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

import { Map as MapGL } from "react-map-gl";
import mapStyle from "@/components/map/map-style.json";
import { ComponentProps } from "react";

export * from "./order";
export * from "./restaurant";
export * from "./user";
export * from "./bow";
export { Marker } from "react-map-gl";

export const Map = ({
  children,
  center,
  ...props
}: {
  children?: React.ReactNode;
  center: {
    latitude: number;
    longitude: number;
  };
} & ComponentProps<typeof MapGL>) => {
  const { latitude, longitude } = center;

  return (
    <>
      <MapGL
        {...props}
        initialViewState={{
          latitude: latitude || 0,
          longitude: longitude || 0,
          zoom: 15,
          pitch: 40,
          ...props.initialViewState,
        }}
        mapStyle={mapStyle as any}
        // styleDiffing
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        {children}
      </MapGL>
    </>
  );
};
