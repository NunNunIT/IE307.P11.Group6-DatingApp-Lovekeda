import { customizeFetch } from "@/lib/functions";
import { auth } from "@/utils/firebase";
import { Session } from "@supabase/supabase-js";
import { SplashScreen } from "expo-router";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User,
  UserCredential,
} from "firebase/auth";
import {
  useState,
  useEffect,
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
} from "react";

type TProfile = {
  _id: number;
  user_id: string | null;
  name: string | null;
  age: number | null;
  bio: string | null;
  gender: string | null;
  hobbies: string[] | null;
  imgs: string[] | null;
  is_complete_profile: boolean | null;
  purposeValue: string | null;
  locate?: { type: string; coordinates: number[] };
  location: string | null;
  genderFind: string | null;
  ageRange: number[] | null;
}

type AuthProps = {
  user: User | null;
  session: Session | null;
  profile: TProfile | null;
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
  registerWithPassword: (data: {
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
  const user_id = user?.uid;
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<TProfile | null>(null);
  const [initialized, setInitialized] = useState<boolean>(false);

  const getProfile = useCallback(
    async (uid: string) => {
      setIsFetching(true);
      try {
        const data = await customizeFetch(`/users/${uid}`);
        console.log("🚀 ~ getProfile ~ data:", data);
        setProfile(data);
      } catch (error: any) {
        console.error("🚀 ~ getProfile ~ error", error?.message);
      } finally {
        setIsFetching(false);
      }
    },
    [setIsFetching, user, setProfile]
  );

  useEffect(() => {
    const subscription = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      setInitialized(true);
      SplashScreen.hideAsync();
    });

    return subscription;
  }, []);

  useEffect(() => {
    if (!user_id) return;
    getProfile(user_id);
  }, [user_id]);

  const loginWithPassword = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const uid = result.user.uid;
    await getProfile(uid);
    return result;
  };

  const registerWithPassword = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    console.log("🚀 ~ AuthProvider ~ result.user.uid:", result.user.uid);
    const body = JSON.stringify({ user_id: result.user.uid, email });
    const data = await customizeFetch("/users", { method: "POST", body });
    console.log("🚀 ~ AuthProvider ~ data:", data);
    return result;
  };

  const signOut = async () => {
    setProfile(null);
    auth.signOut();
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
    registerWithPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
