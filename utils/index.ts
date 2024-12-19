import { useAuth } from "@/provider/AuthProvider";

export async function completeProfile() {
  const { profile, setProfile } = useAuth();
  setProfile({ ...profile, is_complete_profile: true });
}