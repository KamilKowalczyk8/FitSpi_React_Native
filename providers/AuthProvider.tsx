import { useAuthInit } from '@/hooks/useAuthInit';
import { createContext, ReactNode, useState } from 'react';

type User = {
  id: string;
  email: string;
  // miejsce na kolejne pola
};

type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
  register: (email: string, password: string) => Promise<boolean>;
  login: (email: string, password: string, rememberMe: boolean) => Promise<boolean>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setLoading] = useState(true);

  useAuthInit(async () => {
    try {
      setUser(null); 
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  });

  const register = async (email: string, password: string): Promise<boolean> => {
  try {
    const response = await fetch('https://your-api.com/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) return false;

    const data = await response.json();
    setUser(data.user);
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

const login = async (email: string, password: string, rememberMe: boolean): Promise<boolean> => {
  try {
    const response = await fetch('https://your-api.com/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, rememberMe }),
    });

    if (!response.ok) return false;

    const data = await response.json();
    setUser(data.user);
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading, register, login}}>
      {children}
    </AuthContext.Provider>
  );
};
