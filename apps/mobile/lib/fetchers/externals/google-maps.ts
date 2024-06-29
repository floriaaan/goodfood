import { Address } from "@/types/delivery";

export const getPlacesSuggestions = async (query: string): Promise<Prediction[]> => {
  //   TODO: move to backend
  //   console.warn("TODO: move to backend");
  const res = await fetch(
    `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&language=fr&region=fr&key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_APIKEY}`,
  );
  const { predictions } = await res.json();
  if (res.ok) return predictions;
  return [];
};

export const getPlaceDetails = async (placeId: string): Promise<Address | null> => {
  //   TODO: move to backend
  //   console.warn("TODO: move to backend");
  const res = await fetch(
    `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&language=fr&region=fr&key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_APIKEY}`,
  );
  const { result } = await res.json();
  if (res.ok) return parseDetails(result);
  return null;
};

const parseDetails = (details: PlaceDetails): Address => {
  const street = details.name || details.formatted_address || details.vicinity || "";
  const zipcode = details.address_components.find((c) => c.types.includes("postal_code"))?.long_name;
  const city = details.address_components.find((c) => c.types.includes("locality"))?.long_name;
  const country = details.address_components.find((c) => c.types.includes("country"))?.long_name;
  const lat = details.geometry.location.lat;
  const lng = details.geometry.location.lng;

  return { street, zipcode, city, country, lat, lng };
};

export interface PlaceDetails {
  address_components: AddressComponent[];
  adr_address: string;
  formatted_address: string;
  geometry: Geometry;
  icon: string;
  id: string;
  name: string;
  place_id: string;
  reference: string;
  types: string[];
  url: string;
  utc_offset: number;
  vicinity: string;
}

export interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

export interface Geometry {
  location: Location;
  viewport: Viewport;
}

export interface Location {
  lat: number;
  lng: number;
}

export interface Viewport {
  northeast: Location;
  southwest: Location;
}

export interface MatchedSubstring {
  length: number;
  offset: number;
}

export interface MainTextMatchedSubstring {
  length: number;
  offset: number;
}

export interface StructuredFormatting {
  main_text: string;
  main_text_matched_substrings: MainTextMatchedSubstring[];
  secondary_text: string;
}

export interface Term {
  offset: number;
  value: string;
}

export interface Prediction {
  description: string;
  matched_substrings: MatchedSubstring[];
  place_id: string;
  reference: string;
  structured_formatting: StructuredFormatting;
  terms: Term[];
  types: string[];
}
