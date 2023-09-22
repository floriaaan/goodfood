"use client";

import { createContext, useContext, useState, useEffect } from "react";

const LocationContext = createContext({
  lat: NaN,
  lng: NaN,
  refreshLocation: () => {},
});

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) throw new Error("useLocation must be used within a LocationProvider");
  return context;
};

export const LocationProvider = ({ children }: { children: React.ReactNode }) => {
  const [{ lat, lng }, setLocation] = useState({ lat: NaN, lng: NaN });

  const refreshLocation = () => {
    console.log("refreshing location", { lat, lng });
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
      },
      (error) => console.error(error),
      { enableHighAccuracy: true },
    );
  };

  useEffect(() => refreshLocation(), []);

  return <LocationContext.Provider value={{ lat, lng, refreshLocation }}>{children}</LocationContext.Provider>;
};
