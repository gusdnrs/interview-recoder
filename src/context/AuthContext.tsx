'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { User } from '@/types';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Load session on mount & Listen to Auth Changes
  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({ email: session.user.email || '' });
      }
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({ email: session.user.email || '' });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(`로그인 실패: ${error.message}`);
      return false;
    }
    return true;
  };

  const signup = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      // Translate common errors
      if (error.message.includes('already registered')) {
        alert('이미 가입된 이메일입니다.');
      } else {
        alert(`가입 실패: ${error.message}`);
      }
      return false;
    }

    // Auto login happens via onAuthStateChange
    return true;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    router.replace('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
