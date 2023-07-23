import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import * as Location from "expo-location";
import { useColorScheme } from "react-native";

type NativeContextType = {
  location: Location.LocationObject | null;
  setLocation: (location: Location.LocationObject | null) => void;
  theme: "light" | "dark";
};

const NativeContext = createContext<NativeContextType>({
  location: null,
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

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  return (
    <NativeContext.Provider
      value={{
        location,
        setLocation,
        theme,
      }}
    >
      {children}
    </NativeContext.Provider>
  );
};
