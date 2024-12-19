import { useAuth } from "@/provider/AuthProvider";
import { Redirect, Slot } from "expo-router";

export default function SetUpProfileLayout() {
  const { session } = useAuth();
  if (!session) {
    return <Redirect href="/(screen)/auth" />;
  }

  return <Slot />;
};
