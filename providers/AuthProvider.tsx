import { customizeFetch } from "@/lib/functions";
import { auth } from "@/utils/firebase";
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

type AuthProps = {
  user: User | null;
  profile: TProfile | null;
  getProfile?: any;
  setProfile?: any;
  isFetching?: boolean;
  initialized?: boolean;
  signOut?: () => Promise<void>;
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
  const [profile, setProfile] = useState<TProfile | null>(null);
  const [initialized, setInitialized] = useState<boolean>(false);

  const getProfile = useCallback(
    async (uid: string) => {
      setIsFetching(true);
      try {
        const data = await customizeFetch(`/users/${uid}`);
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
    const body = JSON.stringify({ user_id: result.user.uid, email });
    await customizeFetch("/users", { method: "POST", body });
    return result;
  };

  const signOut = async () => {
    setProfile(null);
    auth.signOut();
  };

  const value = {
    user,
    initialized,
    isFetching,
    signOut,
    setProfile,
    profile,
    getProfile,
    loginWithPassword,
    registerWithPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
