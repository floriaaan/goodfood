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
};

const NativeContext = createContext<NativeContextType>({
  location: null,
  locationPermission: undefined,
  setLocation: () => {},
  theme: "light",
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

  useEffect(() => {
    (async () => {
      const permission = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(permission);
      if (permission.status !== "granted") return;

      const location = await Location.getCurrentPositionAsync({
        mayShowUserSettingsDialog: true,
        timeInterval: 1000,
      });
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
      }}
    >
      {children}
    </NativeContext.Provider>
  );
};
