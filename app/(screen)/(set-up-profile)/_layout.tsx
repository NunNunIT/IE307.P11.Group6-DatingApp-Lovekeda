import { useAuth } from "@/provider/AuthProvider";
import { Redirect, Slot } from "expo-router";

export default function SetUpProfileLayout() {
  const { profile, session } = useAuth();
  if (!session) {
    return <Redirect href="/(screen)/auth" />;
  }

  if (profile?.is_complete_profile) {
    return <Redirect href="/(screen)/(main)/(tabs)" />
  }

  return <Slot />;
};
