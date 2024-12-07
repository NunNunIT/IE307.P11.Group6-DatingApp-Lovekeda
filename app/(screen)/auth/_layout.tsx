import { useAuth } from "@/provider/AuthProvider";
import { Redirect, Stack } from "expo-router";

export default function MainLayoutScreen() {
  const { session } = useAuth();
  if (session) {
    return <Redirect href="/(screen)/(main)/(tabs)" />;
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false, title: "" }} />
      <Stack.Screen
        name="loginDev"
        options={{ headerShown: false, title: "" }}
      />
      <Stack.Screen
        name="createProfile"
        options={{ headerShown: false, title: "" }}
      />
    </Stack>
  );
}
