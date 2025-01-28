import { useAuth } from "@/providers/AuthProvider";
import { Redirect, Stack } from "expo-router";

export default function MainLayoutScreen() {
  const { user } = useAuth();
  if (user) return <Redirect href="/(screen)/(main)/(tabs)" />;

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false, title: "" }} />
      <Stack.Screen name="login" options={{ headerShown: false, title: "" }} />
      <Stack.Screen
        name="register"
        options={{ headerShown: false, title: "" }}
      />
    </Stack>
  );
}
