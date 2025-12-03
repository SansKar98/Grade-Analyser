import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';

interface DemoUser {
  id: string;
  name: string;
  role: string;
}

export const DEMO_USERS: DemoUser[] = [
  { id: 'DEMO-ADMIN-001', name: 'Dr. Sarah Mitchell', role: 'Administrator' },
  { id: 'DEMO-TEACH-002', name: 'Prof. James Wilson', role: 'Teacher' },
  { id: 'DEMO-GUEST-003', name: 'Guest User', role: 'Viewer' },
];

interface AuthContextType {
  user: DemoUser | null;
  isAuthenticated: boolean;
  login: (demoId: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DemoUser | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const storedUserId = sessionStorage.getItem('demo_user_id');
    if (storedUserId) {
      const foundUser = DEMO_USERS.find(u => u.id === storedUserId);
      if (foundUser) {
        setUser(foundUser);
      }
    }
  }, []);

  const login = useCallback((demoId: string): boolean => {
    const foundUser = DEMO_USERS.find(u => u.id === demoId.toUpperCase().trim());
    if (foundUser) {
      setUser(foundUser);
      sessionStorage.setItem('demo_user_id', foundUser.id);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem('demo_user_id');
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
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
