import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { User } from '../../../shared/types';

const API = import.meta.env.VITE_API_URL ?? '';

interface AuthState {
  user: User | null;
  accessToken: string | null;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

export interface RegisterData {
  student_id: string;
  name: string;
  email: string;
  password: string;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, accessToken: null });
  const [isLoading, setIsLoading] = useState(true);

  // On mount, try to refresh the access token using the httpOnly refresh cookie
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/api/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
        });
        if (res.ok) {
          const json = await res.json() as { data: { accessToken: string } };
          const token = json.data.accessToken;

          // Fetch current user from dashboard
          const userRes = await fetch(`${API}/api/dashboard/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (userRes.ok) {
            const userJson = await userRes.json() as { data: { user: User } };
            setState({ user: userJson.data.user, accessToken: token });
          }
        }
      } catch {
        // No valid session — stay logged out
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch(`${API}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

    const json = await res.json() as { data?: { user: User; accessToken: string }; error?: string };
    if (!res.ok) throw new Error(json.error ?? 'Login failed');

    setState({ user: json.data!.user, accessToken: json.data!.accessToken });
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    const res = await fetch(`${API}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    const json = await res.json() as { data?: { user: User; accessToken: string }; error?: string };
    if (!res.ok) throw new Error(json.error ?? 'Registration failed');

    setState({ user: json.data!.user, accessToken: json.data!.accessToken });
  }, []);

  const logout = useCallback(async () => {
    await fetch(`${API}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    setState({ user: null, accessToken: null });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
