export type Result = {
  type: string;
  version: string;
  features: Feature[];
  attribution: string;
  licence: string;
  query: string;
  limit: number;
};

export type Feature = {
  type: string;
  geometry: Geometry;
  properties: Properties;
};

export type Geometry = {
  type: string;
  coordinates: number[];
};

export type Properties = {
  label: string;
  score: number;
  id: string;
  name: string;
  postcode: string;
  citycode: string;
  x: number;
  y: number;
  city: string;
  context: string;
  type: string;
  importance: number;
  street: string;
};

export type Suggestion = Feature;
