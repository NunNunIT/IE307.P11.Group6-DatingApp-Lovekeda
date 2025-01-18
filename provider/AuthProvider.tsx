import { auth } from "@/utils/firebase";
import { Session } from "@supabase/supabase-js";
import { SplashScreen } from "expo-router";
import { signInWithEmailAndPassword, User, UserCredential } from "firebase/auth";
import {
  useState,
  useEffect,
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
} from "react";

import { supabase } from "~/utils/supabase";

type AuthProps = {
  user: User | null;
  session: Session | null;
  profile: {
    age: number | null;
    bio: string | null;
    created_at: string;
    gender: string | null;
    genderFind: string | null;
    hobbies: string[] | null;
    id: number;
    imgs: string[] | null;
    is_complete_profile: boolean | null;
    name: string | null;
    purposeValue: string | null;
    user_id: string | null;
    display_address: string | null;
  } | null;
  getProfile?: any;
  setProfile?: any;
  isFetching?: boolean;
  initialized?: boolean;
  signOut?: () => Promise<void>;
  setSession?: any;
  loginWithPassword: (data: {
    email: string;
    password: string;
  }) => Promise<UserCredential>;
};

export const AuthContext = createContext<AuthProps | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<{
    age: number | null;
    bio: string | null;
    created_at: string;
    gender: string | null;
    genderFind: string | null;
    hobbies: string[] | null;
    id: number;
    imgs: string[] | null;
    is_complete_profile: boolean | null;
    name: string | null;
    purposeValue: string | null;
    user_id: string | null;
    display_address: string | null;
  } | null>(null);
  const [initialized, setInitialized] = useState<boolean>(false);

  const getProfile = useCallback(async () => {
    setIsFetching(true);
    try {
      const { user } = session ?? {};
      if (!user) return;
      const [
        { data: profile, error: profileError },
        { data: location, error: locationError },
      ] = await Promise.all([
        supabase.from("profiles").select().eq("user_id", user.id),
        supabase
          .from("locations")
          .select("display_address")
          .eq("user_id", user.id),
      ]);

      if (profileError) throw profileError;
      if (locationError) throw locationError;
      setProfile({
        ...profile?.[0],
        display_address: location?.[0]?.display_address,
      });
    } finally {
      setIsFetching(false);
    }
  }, [setIsFetching, session, setProfile]);

  useEffect(() => {
    // Listen for changes to authentication state
    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      setInitialized(false);
      setSession(session);
      if (session) {
        await getProfile();
      }
      setInitialized(true);
      SplashScreen.hideAsync();
    });
    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const subscription = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      setInitialized(true);
    });

    return subscription;
  }, []);

  const loginWithPassword = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Log out the user
  const signOut = async () => {
    await Promise.all([
      supabase.auth.signOut(),
      // GoogleSignin.signOut()
    ]);
  };

  const value = {
    user,
    session,
    initialized,
    isFetching,
    signOut,
    setSession,
    setProfile,
    profile,
    getProfile,
    loginWithPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
