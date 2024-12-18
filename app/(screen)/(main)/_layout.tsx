import { Redirect, Stack } from "expo-router";
import React from "react";
import { useAuth } from "~/provider/AuthProvider";
import { LocationProvider, useLocation } from "@/provider/LocationProvider";

export default function NotesLayoutScreen() {
  const { session, profile } = useAuth();
  if (!session) {
    return <Redirect href="/(screen)/auth" />;
  }

  if (!profile?.is_complete_profile) {
    return <Redirect href="/(screen)/(set-up-profile)" />;
  }

  return (
    <LocationProvider>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
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
