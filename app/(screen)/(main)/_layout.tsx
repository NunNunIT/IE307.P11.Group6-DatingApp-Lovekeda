import { Redirect, Stack } from "expo-router";
import React from "react";
import { useAuth } from "~/provider/AuthProvider";
import { LocationProvider } from "@/provider/LocationProvider";
import Spinner from "react-native-loading-spinner-overlay";

export default function NotesLayoutScreen() {
  const { isFetching, session, profile } = useAuth();
  if (!session) {
    return <Redirect href="/(screen)/auth" />;
  }

  if (!isFetching && !profile?.is_complete_profile) {
    return <Redirect href="/(screen)/(set-up-profile)" />;
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
        <Stack.Screen name="noti" options={{ title: "Thông báo" }} />
        <Stack.Screen name="notiDetail/[id]" options={{ title: "" }} />
        <Stack.Screen name="profileDetail/[id]" options={{ title: "" }} />
        <Stack.Screen
          name="chatDetail/[id]"
          options={{ title: "", headerShown: false }}
        />
        <Stack.Screen name="filter" options={{ title: "" }} />
        <Stack.Screen name="editProfile" options={{ title: "Sửa hồ sơ" }} />
        <Stack.Screen name="permissionError" options={{ headerShown: false }} />
      </Stack>
    </LocationProvider>
  );
}
