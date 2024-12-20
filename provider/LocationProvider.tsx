import React, { createContext, useContext, useEffect, useState } from "react";
import * as Location from "expo-location";

type TPermissionStatus = "pending" | "granted" | "denied";

const LocationContext = createContext<{
  location: Location.LocationObject | null;
  permissionStatus: TPermissionStatus;
  checking: () => Promise<void>;
}>({} as any);

export const LocationProvider = ({ children }: { children: React.ReactNode }) => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<TPermissionStatus>("pending");
  const checking = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === "granted") {
      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      setPermissionStatus("granted");
    } else {
      setPermissionStatus("denied");
    }
  };

  useEffect(() => {
    checking();
  }, []);

  return (
    <LocationContext.Provider value={{ location, permissionStatus, checking }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);
