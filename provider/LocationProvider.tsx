import React, { createContext, useContext, useEffect, useState } from "react";
import * as Location from "expo-location";

const LocationContext = createContext(null);

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState("pending");

  useEffect(() => {
    (async () => {
      // Kiểm tra quyền truy cập vị trí
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
        setPermissionStatus("granted");
      } else {
        setPermissionStatus("denied");
      }
    })();
  }, []);

  return (
    <LocationContext.Provider value={{ location, permissionStatus }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);
