import { Redirect, Stack } from "expo-router";
import React from "react";
import { useAuth } from "~/provider/AuthProvider";

import { Button } from "~/components/ui/button";

export default function NotesLayoutScreen() {
  const { session } = useAuth();
  if (!session) {
    return <Redirect href="/(screen)/auth" />;
  }

  return (
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
    </Stack>
  );
}
