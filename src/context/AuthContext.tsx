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

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  signup: (email: string, password: string) => boolean;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Load session on mount
  useEffect(() => {
    const storedSession = localStorage.getItem('interview-session');
    if (storedSession) {
      setUser(JSON.parse(storedSession));
    }
    setIsLoading(false);
  }, []);

  const login = (email: string, password: string) => {
    const usersStr = localStorage.getItem('interview-users');
    const users: User[] = usersStr ? JSON.parse(usersStr) : [];

    // Find user
    const foundUser = users.find(
      (u) => u.email === email && u.password === password,
    );

    if (foundUser) {
      // Remove password from session for safety
      const sessionUser = { ...foundUser };
      delete sessionUser.password;

      setUser(sessionUser);
      localStorage.setItem('interview-session', JSON.stringify(sessionUser));
      return true;
    }
    return false;
  };

  const signup = (email: string, password: string) => {
    const usersStr = localStorage.getItem('interview-users');
    const users: User[] = usersStr ? JSON.parse(usersStr) : [];

    // Check if exists
    if (users.some((u) => u.email === email)) {
      alert('이미 존재하는 이메일입니다.');
      return false;
    }

    const newUser: User = { email, password };
    users.push(newUser);
    localStorage.setItem('interview-users', JSON.stringify(users));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('interview-session');
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
