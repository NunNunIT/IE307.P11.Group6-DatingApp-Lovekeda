// 21522436 - Nguyễn Thị Hồng Nhung
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Session } from '@supabase/supabase-js';
import { SplashScreen } from 'expo-router';
import {
  useState, useEffect,
  createContext, PropsWithChildren,
  useCallback,
  useContext
} from 'react';

import { supabase } from '~/utils/supabase';

type AuthProps = {
  session: Session | null;
  profile: {
    age: number | null
    bio: string | null
    created_at: string
    gender: string | null
    genderFind: string | null
    hobbies: string[] | null
    id: number
    imgs: string[] | null
    is_complete_profile: boolean | null
    name: string | null
    purposeValue: string | null
    user_id: string | null
  } | null;
  getProfile?: any;
  setProfile?: any;
  isFetching?: boolean;
  initialized?: boolean;
  signOut?: () => Promise<void>;
  setSession?: any;
};

export const AuthContext = createContext<Partial<AuthProps>>({});

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<{
    age: number | null
    bio: string | null
    created_at: string
    gender: string | null
    genderFind: string | null
    hobbies: string[] | null
    id: number
    imgs: string[] | null
    is_complete_profile: boolean | null
    name: string | null
    purposeValue: string | null
    user_id: string | null
  } | null>(null);
  const [initialized, setInitialized] = useState<boolean>(false);

  const getProfile = useCallback(async () => {
    setIsFetching(true);
    try {
      const { user } = session ?? {};
      if (!user) return;
      const { data, error } = await supabase
        .from('profiles')
        .select()
        .eq('user_id', user.id)

      if (error) throw error;
      setProfile(data?.[0]);
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

  // Log out the user
  const signOut = async () => {
    await Promise.all([
      supabase.auth.signOut(),
      GoogleSignin.signOut()
    ]);
  };

  const value = {
    session,
    initialized,
    isFetching,
    signOut,
    setSession,
    setProfile,
    profile,
    getProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
