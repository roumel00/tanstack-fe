import { createContext, useContext, useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { useRouter } from '@tanstack/react-router';
import type { User, SessionData } from '@/lib/auth-client';

type AuthResponse = {
  user: User;
  session: SessionData;
} | null;

interface AuthContextType {
  user: User | null;
  session: SessionData | null;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ initialAuth, children }: { initialAuth: AuthResponse, children: React.ReactNode }) {
  const router = useRouter();
  const [authData, setAuthData] = useState<AuthResponse>(initialAuth);

  const logout = async () => {
    await authClient.signOut();
    
    setAuthData(null);

    await router.invalidate();
  };

  const contextValue: AuthContextType = {
    user: authData?.session?.user ?? null,
    session: authData?.session ?? null,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};