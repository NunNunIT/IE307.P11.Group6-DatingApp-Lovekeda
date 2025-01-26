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
  useContext,
} from "react";
import useSWR from "swr";

type AuthProps = {
  user: User | null;
  profile: TProfile | undefined;
  getProfile?: any;
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
  const {
    data: profile,
    isLoading: isFetching,
    mutate: getProfile,
  } = useSWR<TProfile>(user_id ? `/users/${user_id}` : null, customizeFetch);
  const [initialized, setInitialized] = useState<boolean>(false);

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
    getProfile();
  }, [user_id]);

  const loginWithPassword = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    await getProfile();
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
    auth.signOut();
  };

  const value = {
    user,
    initialized,
    isFetching,
    signOut,
    profile,
    getProfile,
    loginWithPassword,
    registerWithPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
