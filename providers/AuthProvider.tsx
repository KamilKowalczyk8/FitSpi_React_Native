import { useAuthInit } from '@/hooks/useAuthInit';
import { createContext, ReactNode, useState } from 'react';

type User = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
};
type AuthContextType = {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  isLoading: boolean;
  register: (userData: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => Promise<boolean>;
  login: (
    email: string,
    password: string,
    rememberMe: boolean
  ) => Promise<boolean>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(true);

  useAuthInit(async () => {
    try {
      setUser(null);
      setToken(null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  });

  const register = async (userData: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }): Promise<boolean> => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/auth/register`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData),
          //credentials: 'include',
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Register failed:', errorText);
        return false;
      }

      const data = await response.json();
      if (data.user) {
        setUser(data.user);
        if (data.access_token) setToken(data.access_token); 
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const login = async (
  email: string,
  password: string,
  rememberMe: boolean
): Promise<boolean> => {
  try {
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, rememberMe }),
    });
console.log('RESPONSE STATUS:', response.status);
console.log('RESPONSE HEADERS:', response.headers);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Login failed:', errorText);
      return false;
    }

    const data = await response.json();
    console.log('Odpowiedź backendu:', data);

    if (data.success && data.access_token) {
      setUser(data.user);
      setToken(data.access_token); 
      return true;
    }

    console.warn("Brak tokena w odpowiedzi backendu");
    return false;
  } catch (err) {
    console.error(err);
    return false;
  }
};


  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, setUser, setToken, isLoading, register, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
