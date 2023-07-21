import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import * as Location from "expo-location";

type NativeContextType = {
  location: Location.LocationObject | null;
  setLocation: (location: Location.LocationObject | null) => void;
};

const NativeContext = createContext<NativeContextType>({
  location: null,
  setLocation: () => {},
});

export const useNative = () => {
  const context = useContext(NativeContext);
  if (!context)
    throw new Error("useNative must be used within a NativeProvider");
  return context;
};

export const NativeProvider = ({ children }: { children: ReactNode }) => {
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
      }}
    >
      {children}
    </NativeContext.Provider>
  );
};
