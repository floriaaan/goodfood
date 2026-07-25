"use client";

import mapStyle from "@/components/map/map-style.json";
import { FREE_MAP_STYLE, HAS_MAPBOX_TOKEN, MAPBOX_TOKEN, MapboxMap, MapLibreMap } from "@/components/map/gl";
import { ComponentProps } from "react";

export { Marker, Popup } from "@/components/map/gl";
export * from "./bow";
export * from "./order";
export * from "./restaurant";
export * from "./user";

type MapProps = {
  children?: React.ReactNode;
  center: {
    latitude: number;
    longitude: number;
  };
  mapRef?: any;
} & ComponentProps<typeof MapboxMap>;

export const Map = ({ children, center, mapRef, ...props }: MapProps) => {
  const { latitude, longitude } = center;
  const initialViewState = {
    latitude: latitude || 0,
    longitude: longitude || 0,
    zoom: 15,
    pitch: 40,
    ...props.initialViewState,
  };

  if (!HAS_MAPBOX_TOKEN)
    return (
      <MapLibreMap
        {...(props as ComponentProps<typeof MapLibreMap>)}
        ref={mapRef}
        initialViewState={initialViewState as ComponentProps<typeof MapLibreMap>["initialViewState"]}
        mapStyle={FREE_MAP_STYLE}
      >
        {children}
      </MapLibreMap>
    );

  return (
    <MapboxMap
      {...props}
      ref={mapRef}
      initialViewState={initialViewState}
      mapStyle={mapStyle as any}
      mapboxAccessToken={MAPBOX_TOKEN}
    >
      {children}
    </MapboxMap>
  );
};
