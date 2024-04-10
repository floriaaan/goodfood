"use client";

import { useQuery } from "@tanstack/react-query";
import { createContext, useContext } from "react";

import { useNative } from "@/hooks/useNative";
import { fetchAPI } from "@/lib/fetchAPI";
import { Restaurant } from "@/types/restaurant";

const LocationContext = createContext({
  lat: NaN,
  lng: NaN,
  restaurants: [] as Restaurant[],
  loading: true,
} as {
  lat: number;
  lng: number;
  restaurants: Restaurant[];
  loading: boolean;
});

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) throw new Error("useLocation must be used within a LocationProvider");
  return context;
};

export const LocationProvider = ({ children }: { children: React.ReactNode }) => {
  const { location } = useNative();
  const { lat, lng } = { lat: location?.coords.latitude || NaN, lng: location?.coords.longitude || NaN };

  const { data: restaurantList, isLoading } = useQuery<Restaurant[]>({
    queryKey: ["restaurant", `${lat}-${lng}`],

    queryFn: async () => {
      const res = await fetchAPI(`/api/restaurant/by-location`, undefined, {
        method: "POST",
        body: JSON.stringify({ lat, lng }),
      });
      const body = await res.json();
      return body.restaurantsList;
    },
    placeholderData: [],
    enabled: lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng),
  });

  return (
    <LocationContext.Provider
      value={{
        lat,
        lng,
        restaurants: restaurantList ?? [],
        loading: isLoading || !(lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng)),
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};
