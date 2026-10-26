import { createContext, useContext, useState, ReactNode } from 'react';
import { users, User } from '../data/mockData';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  referralCode: string;
  role: 'member' | 'leader' | 'admin';
  isLeader: boolean;
  teamSize: number;
  joinDate: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => boolean;
  register: (data: { name: string; email: string; phone: string; password: string; referralCode?: string }) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = (email: string, _password: string): boolean => {
    const found = users.find(u => u.email === email);
    if (found) {
      const role = found.id === '1' ? 'admin' : found.isLeader ? 'leader' : 'member';
      setUser({
        id: found.id,
        name: found.name,
        email: found.email,
        phone: found.phone,
        referralCode: found.referralCode,
        role,
        isLeader: found.isLeader,
        teamSize: found.teamSize,
        joinDate: found.joinDate,
      });
      return true;
    }
    return false;
  };

  const register = (data: { name: string; email: string; phone: string; password: string; referralCode?: string }): boolean => {
    const newUser: AuthUser = {
      id: String(users.length + 1),
      name: data.name,
      email: data.email,
      phone: data.phone,
      referralCode: data.referralCode || `REF${String(users.length + 1).padStart(3, '0')}`,
      role: 'member',
      isLeader: false,
      teamSize: 0,
      joinDate: new Date().toISOString().split('T')[0],
    };
    setUser(newUser);
    return true;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
