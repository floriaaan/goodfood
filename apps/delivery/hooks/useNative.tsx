import * as Location from "expo-location";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useColorScheme } from "react-native";

type NativeContextType = {
  location: Location.LocationObject | null;
  locationPermission: Location.LocationPermissionResponse | undefined;
  setLocation: (location: Location.LocationObject | null) => void;
  theme: "light" | "dark";
  updateFrequency: number;
  setUpdateFrequency: (frequency: number) => void;
};

const NativeContext = createContext<NativeContextType>({
  location: null,
  locationPermission: undefined,
  setLocation: () => {},
  theme: "light",
  updateFrequency: 60 * 1000, // WARNING: every 60 seconds, there will be a call to mapbox API for every order in the list to update ETA
  setUpdateFrequency: () => {},
});

export const useNative = () => {
  const context = useContext(NativeContext);
  if (!context)
    throw new Error("useNative must be used within a NativeProvider");
  return context;
};

export const NativeProvider = ({ children }: { children: ReactNode }) => {
  const theme = useColorScheme() ?? "light";
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [locationPermission, setLocationPermission] =
    useState<Location.LocationPermissionResponse>();

  const [updateFrequency, setUpdateFrequency] = useState(60 * 1000);

  useEffect(() => {
    (async () => {
      const permission = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(permission);
      if (permission.status !== "granted") return;

      const location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  

  return (
    <NativeContext.Provider
      value={{
        location,
        locationPermission,
        setLocation,
        theme,
        updateFrequency,
        setUpdateFrequency,
      }}
    >
      {children}
    </NativeContext.Provider>
  );
};
