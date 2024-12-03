import { router, Stack } from "expo-router";
import React from "react";

import { Button } from "~/components/ui/button";

export default function NotesLayoutScreen() {
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
      <Stack.Screen name="chatDetail/[id]" options={{ title: "" }} />
      <Stack.Screen name="filter" options={{ title: "" }} />
      <Stack.Screen name="editProfile" options={{ title: "Sửa hồ sơ" }} />
    </Stack>
  );
}
