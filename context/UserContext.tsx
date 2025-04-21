'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type UserContextType = {
  user: string | null;
  login: (email: string) => void;
  logout: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be inside UserProvider');
  return context;
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('userEmail');
    if (stored) setUser(stored);
  }, []);

  const login = (email: string) => {
    localStorage.setItem('userEmail', email);
    setUser(email);
  };

  const logout = () => {
    localStorage.removeItem('userEmail');
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}
