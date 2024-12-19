import { useAuth } from "@/provider/AuthProvider";
import { Redirect, Stack } from "expo-router";

export default function MainLayoutScreen() {
  const { session } = useAuth();
  if (session?.user) {
    return <Redirect href="/(screen)/(set-up-profile)" />;
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false, title: "" }} />
      <Stack.Screen name="login" options={{ headerShown: false, title: "" }} />
      <Stack.Screen name="register" options={{ headerShown: false, title: "" }} />
    </Stack>
  );
}
