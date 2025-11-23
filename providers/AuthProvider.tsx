import * as SecureStore from 'expo-secure-store';
import { createContext, ReactNode, useState } from 'react';
import { useAuthInit } from '../hooks/useAuthInit';

type User = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role_id: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  isLoading: boolean;
  register: (userData: any) => Promise<boolean>;
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
      const storedToken = await SecureStore.getItemAsync('accessToken');
      
      if (storedToken) {
        console.log("♻️ Znaleziono token w SecureStore, przywracam sesję...");
        setToken(storedToken);

        const apiUrl = process.env.EXPO_PUBLIC_API_URL;
        if (apiUrl) {
            try {
                const response = await fetch(`${apiUrl}/auth/currentUser`, {
                    headers: { Authorization: `Bearer ${storedToken}` }
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.user) {
                        setUser(data.user);
                    }
                } else {
                    console.warn("Token wygasł lub jest nieprawidłowy.");
                    await SecureStore.deleteItemAsync('accessToken');
                    setToken(null);
                    setUser(null);
                }
            } catch (e) {
                console.error("Błąd pobierania usera przy starcie", e);
            }
        }
      } else {
        setToken(null);
        setUser(null);
      }
    } catch (err) {
      console.error('Auth init error:', err);
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  });

  const register = async (userData: any): Promise<boolean> => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/auth/register`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData),
        }
      );

      if (!response.ok) return false;

      const data = await response.json();
      if (data.user) {
        setUser(data.user);
        if (data.access_token) {
            setToken(data.access_token);
        }
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
    console.log(`🟡 Próba logowania. RememberMe: ${rememberMe}`);
    
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Login failed:', errorText);
        return false;
      }

      const data = await response.json();

      if (data.success && data.access_token) {
        setUser(data.user);
        setToken(data.access_token);

        if (rememberMe) {
            console.log("💾 [SECURE STORE] Zapisuję token na stałe");
            await SecureStore.setItemAsync('accessToken', data.access_token);
        } else {
            console.log("🗑️ [SECURE STORE] Nie zapisuję na stałe (lub czyszczę stary)");
            await SecureStore.deleteItemAsync('accessToken');
        }

        
        return true;
      }

      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const logout = async () => {
    try {
      if (token) {
        try {
            await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/logout`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            });
        } catch (e) { console.warn("Backend logout warning", e); }
      }
    } finally {
      await SecureStore.deleteItemAsync('accessToken');
      setToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, setUser, setToken, isLoading, register, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};