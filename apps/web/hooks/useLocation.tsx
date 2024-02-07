"use client";

import { fetchAPI } from "@/lib/fetchAPI";
import { Restaurant } from "@/types/restaurant";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useState, useEffect } from "react";

const LocationContext = createContext({
  lat: NaN,
  lng: NaN,
  refreshLocation: () => {},
  restaurants: [] as Restaurant[],
} as {
  lat: number;
  lng: number;
  refreshLocation: () => void;
  restaurants: Restaurant[];
});

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) throw new Error("useLocation must be used within a LocationProvider");
  return context;
};

export const LocationProvider = ({ children }: { children: React.ReactNode }) => {
  const [{ lat, lng }, setLocation] = useState({ lat: NaN, lng: NaN });

  const { data: restaurantList, refetch } = useQuery<Restaurant[]>({
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

  const refreshLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        refetch();
      },
      // eslint-disable-next-line no-console
      (error) => console.error(error),
      { enableHighAccuracy: true },
    );
  };

  useEffect(() => refreshLocation(), []);

  return (
    <LocationContext.Provider value={{ lat, lng, refreshLocation, restaurants: restaurantList ?? [] }}>
      {children}
    </LocationContext.Provider>
  );
};
