"use client";

import "mapbox-gl/dist/mapbox-gl.css";
import "maplibre-gl/dist/maplibre-gl.css";

import * as Mapbox from "react-map-gl/mapbox";
import * as MapLibre from "react-map-gl/maplibre";

// A Mapbox token unlocks our branded vector style (map-style.json points at mapbox://-hosted
// tiles, which only resolve with a token). Without one, fall back to MapLibre GL pointed at
// CARTO's free, signup-free basemaps instead of crashing — same approach as
// https://github.com/AnmolSaini16/mapcn's zero-config default.
//
// Marker/Popup/Source/Layer must come from the same underlying library as the Map they're
// nested in (each variant wires its own React context), so this is the single place that picks
// one; every other map file imports these primitives from here (or from @/components/map)
// instead of react-map-gl directly.
export const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
export const HAS_MAPBOX_TOKEN = !!MAPBOX_TOKEN;

export const FREE_MAP_STYLE = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

export const MapboxMap = Mapbox.Map;
export const MapLibreMap = MapLibre.Map;

export const Marker = (HAS_MAPBOX_TOKEN ? Mapbox.Marker : MapLibre.Marker) as typeof Mapbox.Marker;
export const Popup = (HAS_MAPBOX_TOKEN ? Mapbox.Popup : MapLibre.Popup) as typeof Mapbox.Popup;
export const Source = (HAS_MAPBOX_TOKEN ? Mapbox.Source : MapLibre.Source) as typeof Mapbox.Source;
export const Layer = (HAS_MAPBOX_TOKEN ? Mapbox.Layer : MapLibre.Layer) as typeof Mapbox.Layer;
