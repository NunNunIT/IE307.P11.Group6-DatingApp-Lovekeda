import { Redirect, Stack } from "expo-router";
import React from "react";
import { useAuth } from "~/provider/AuthProvider";
import { LocationProvider } from "@/provider/LocationProvider";

export default function NotesLayoutScreen() {
  const { isFetching, user, profile } = useAuth();
  if (!user) return <Redirect href="/(screen)/auth" />;

  if (!isFetching && !profile?.is_complete_profile)
    return <Redirect href="/(screen)/set-up-profile" />;

  return (
    <LocationProvider>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false, title: "" }}
        />
        <Stack.Screen name="settings" options={{ title: "Cài đặt" }} />
        <Stack.Screen name="noti" options={{ title: "Thông báo" }} />
        <Stack.Screen name="noti-detail/[id]" options={{ title: "" }} />
        <Stack.Screen name="profile-detail/[id]" />
        <Stack.Screen
          name="chat-detail/[id]"
          options={{ title: "", headerShown: false }}
        />
        <Stack.Screen name="filter" options={{ title: "" }} />
        <Stack.Screen name="edit-profile" options={{ title: "Sửa hồ sơ" }} />
        <Stack.Screen
          name="permission-error"
          options={{ headerShown: false }}
        />
      </Stack>
    </LocationProvider>
  );
}
