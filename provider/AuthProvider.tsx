// 21522436 - Nguyễn Thị Hồng Nhung
// import { GoogleSignin } from '@react-native-google-signin/google-signin';
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
    created_at: string;
    id: string;
    is_complete_profile: boolean | null;
  } | null;
  getProfile?: any;
  setProfile?: any;
  initialized?: boolean;
  signOut?: () => Promise<void>;
  setSession?: any;
};

export const AuthContext = createContext<Partial<AuthProps>>({});

export function useAuth() {
  const context =  useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<{
    created_at: string;
    id: string;
    is_complete_profile: boolean | null;
  } | null>(null);
  const [initialized, setInitialized] = useState<boolean>(false);

  const getProfile = useCallback(async () => {
    const { user } = session ?? {};
    if (!user) return;
    const { data, error } = await supabase
      .from('profiles')
      .select()
      .eq('id', user.id)

    if (error) throw error;
    console.log("🚀 ~ getProfile ~ data:", data)
    setProfile(data[0]);
  }, []);

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
      // GoogleSignin.signOut()
    ]);
  };

  const value = {
    session,
    initialized,
    signOut,
    setSession,
    setProfile,
    profile,
    getProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
