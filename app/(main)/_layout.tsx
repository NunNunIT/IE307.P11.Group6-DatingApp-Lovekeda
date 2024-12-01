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
      <Stack.Screen name="settings" options={{ title: "Settings" }} />
      <Stack.Screen name="noti" options={{ title: "Noti" }} />
      <Stack.Screen name="filter" options={{ title: "Filter" }} />
      <Stack.Screen name="editProfile" options={{ title: "Edit Profile" }} />
    </Stack>
  );
}
