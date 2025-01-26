import { createContext, useContext, useEffect, useState } from "react";
import * as Location from "expo-location";
import { useAuth } from "./AuthProvider";
import { customizeFetch } from "@/lib/functions";

type TPermissionStatus = "pending" | "granted" | "denied";

const LocationContext = createContext<{
  location: [number, number] | null;
  permissionStatus: TPermissionStatus;
  checking: () => Promise<void>;
}>({} as any);

export const LocationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user, getProfile } = useAuth();
  const [location, setLocation] = useState<[number, number] | null>(null);
  const [permissionStatus, setPermissionStatus] =
    useState<TPermissionStatus>("pending");
  const checking = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setPermissionStatus("denied");
      return;
    }

    const { coords } = await Location.getCurrentPositionAsync({});
    const coordinates = [coords.longitude, coords.latitude] as [number, number];
    setLocation(coordinates);
    setPermissionStatus("granted");
    if (!user) return;

    const location = await customizeFetch(`/common/location?lat=${coordinates[1]}&long=${coordinates[0]}`);
    const { display_name } = location;
    await customizeFetch(`/users/${user.uid}`, {
      method: "PATCH",
      body: JSON.stringify({
        locate: { type: "Point", coordinates },
        location: display_name,
      }),
    });
    await getProfile(user.uid);
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
