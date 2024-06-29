import "dotenv/config";

export interface Result {
  routes: Route[];
  waypoints: Waypoint[];
  code: string;
  uuid: string;
}

export interface Route {
  weight_name: string;
  weight: number;
  // duration in seconds
  duration: number;
  // distance in meters
  distance: number;
  legs: Leg[];
  geometry: Geometry2;
}

export interface Leg {
  notifications: Notification[];
  via_waypoints: any[];
  admins: Admin[];
  weight: number;
  duration: number;
  steps: Step[];
  distance: number;
  summary: string;
}

export interface Notification {
  details: Details;
  subtype: string;
  type: string;
  geometry_index_end: number;
  geometry_index_start: number;
}

export interface Details {
  actual_value: string;
  message: string;
}

export interface Admin {
  iso_3166_1_alpha3: string;
  iso_3166_1: string;
}

export interface Step {
  intersections: Intersection[];
  maneuver: Maneuver;
  name: string;
  duration: number;
  distance: number;
  driving_side: string;
  weight: number;
  mode: string;
  geometry: Geometry;
  ref?: string;
  destinations?: string;
  exits?: string;
}

export interface Intersection {
  bearings: number[];
  entry: boolean[];
  mapbox_streets_v8?: MapboxStreetsV8;
  is_urban?: boolean;
  admin_index: number;
  out?: number;
  geometry_index: number;
  location: number[];
  in?: number;
  duration?: number;
  turn_weight?: number;
  turn_duration?: number;
  weight?: number;
  classes?: string[];
  toll_collection?: TollCollection;
  lanes?: Lane[];
  stop_sign?: boolean;
}

export interface MapboxStreetsV8 {
  class: string;
}

export interface TollCollection {
  name?: string;
  type: string;
}

export interface Lane {
  indications: string[];
  valid_indication?: string;
  valid: boolean;
  active: boolean;
}

export interface Maneuver {
  type: string;
  instruction: string;
  bearing_after: number;
  bearing_before: number;
  location: number[];
  modifier?: string;
  exit?: number;
}

export interface Geometry {
  coordinates: number[][];
  type: string;
}

export interface Geometry2 {
  coordinates: number[][];
  type: string;
}

export interface Waypoint {
  distance: number;
  name: string;
  location: number[];
}

export const getDirections = async (
  points: {
    lat: number;
    lng: number;
  }[]
) => {
  const response = await fetch(
    `https://api.mapbox.com/directions/v5/mapbox/driving/${points
      .map((p) => p.lng + "," + p.lat)
      .join(";")}?access_token=${process.env.MAPBOX_TOKEN}`
  );

  const res = await response.json();
  return res as Result;
};
