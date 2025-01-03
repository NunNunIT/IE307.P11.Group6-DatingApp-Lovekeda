import { Redirect, Stack } from "expo-router";
import React, { useEffect } from "react";
import { useAuth } from "~/provider/AuthProvider";
import { LocationProvider } from "@/provider/LocationProvider";
import Spinner from "react-native-loading-spinner-overlay";

export default function NotesLayoutScreen() {
  const { isFetching, session, profile } = useAuth();
  if (!session) {
    return <Redirect href="/(screen)/auth" />;
  }

  return (
    <LocationProvider>
      <Spinner visible={isFetching} />
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
            title: ""
          }}
        />
        <Stack.Screen name="settings" options={{ title: "Cài đặt" }} />
        <Stack.Screen name="productDetail/[id]" options={{ title: "" }} />
        <Stack.Screen name="editProfile" options={{ title: "Sửa hồ sơ" }} />
      </Stack>
    </LocationProvider>
  );
}
