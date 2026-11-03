import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface RegisteredUser {
  id: string;
  name: string;
  mobile: string;
  email?: string;
  phone?: string;
  referralCode: string;
  referredBy: string;
  city: string;
  role: 'member' | 'leader' | 'admin' | 'individual';
  isLeader: boolean;
  teamSize: number;
  joinDate: string;
}

interface AuthContextType {
  user: RegisteredUser | null;
  /** OTP must already be verified by the caller — passwordless login */
  login: (mobile: string) => { success: boolean; message: string };
  register: (data: {
    name: string;
    mobile: string;
    city?: string;
    referralCode?: string;
    role: 'member' | 'leader' | 'individual';
  }) => { success: boolean; message: string; user?: RegisteredUser };
  logout: () => void;
  getAllUsers: () => RegisteredUser[];
  /** Promote to leader when team hits 100 (leader remains a member too) */
  promoteToLeaderIfEligible: (teamSize: number) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Demo users (pre-seeded) — OTP only, no password
const DEMO_USERS: RegisteredUser[] = [
  {
    id: '1',
    name: 'Admin User',
    mobile: '9876543210',
    referralCode: 'ADMIN001',
    referredBy: '',
    city: 'Jaipur',
    role: 'admin',
    isLeader: true,
    teamSize: 250,
    joinDate: '2023-01-01',
  },
  {
    id: '2',
    name: 'Rajesh Kumar',
    mobile: '9876543211',
    referralCode: 'RAJ002',
    referredBy: '1',
    city: 'Delhi',
    role: 'leader',
    isLeader: true,
    teamSize: 120,
    joinDate: '2023-03-15',
  },
  {
    id: '3',
    name: 'Priya Sharma',
    mobile: '9876543212',
    referralCode: 'PRI003',
    referredBy: '2',
    city: 'Mumbai',
    role: 'member',
    isLeader: false,
    teamSize: 45,
    joinDate: '2023-05-20',
  },
  {
    id: '4',
    name: 'Amit Patel',
    mobile: '9876543213',
    referralCode: '',
    referredBy: '',
    city: 'Ahmedabad',
    role: 'individual',
    isLeader: false,
    teamSize: 0,
    joinDate: '2024-01-15',
  },
];

function stripPassword(u: RegisteredUser & { password?: string }): RegisteredUser {
  const { password: _p, ...rest } = u;
  return rest;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<RegisteredUser | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('jwellbox_current_user');
    if (savedUser) {
      try {
        setUser(stripPassword(JSON.parse(savedUser)));
      } catch {
        localStorage.removeItem('jwellbox_current_user');
      }
    }
  }, []);

  useEffect(() => {
    const existingUsers = localStorage.getItem('jwellbox_users');
    if (!existingUsers) {
      localStorage.setItem('jwellbox_users', JSON.stringify(DEMO_USERS));
      return;
    }
    // Migrate any stored users that still have password fields
    try {
      const users = (JSON.parse(existingUsers) as Array<RegisteredUser & { password?: string }>).map(
        stripPassword
      );
      localStorage.setItem('jwellbox_users', JSON.stringify(users));
    } catch {
      localStorage.setItem('jwellbox_users', JSON.stringify(DEMO_USERS));
    }
  }, []);

  const getAllUsers = (): RegisteredUser[] => {
    const stored = localStorage.getItem('jwellbox_users');
    if (stored) {
      try {
        return (JSON.parse(stored) as Array<RegisteredUser & { password?: string }>).map(
          stripPassword
        );
      } catch {
        return DEMO_USERS;
      }
    }
    return DEMO_USERS;
  };

  const register = (data: {
    name: string;
    mobile: string;
    city?: string;
    referralCode?: string;
    role: 'member' | 'leader' | 'individual';
  }) => {
    const users = getAllUsers();

    const existing = users.find(u => u.mobile === data.mobile);
    if (existing) {
      const roleLabel =
        existing.role === 'leader' || existing.isLeader
          ? 'leader'
          : existing.role === 'admin'
            ? 'admin'
            : existing.role === 'individual'
              ? 'buyer'
              : 'member';
      return {
        success: false,
        message: `Ye number pehle se hi ${roleLabel} hai. Dobara member nahi ban sakte — login with OTP use karo.`,
      };
    }

    const referralCode =
      data.role === 'individual'
        ? ''
        : data.name.substring(0, 3).toUpperCase() +
          Math.floor(100 + Math.random() * 900).toString();

    const newUser: RegisteredUser = {
      id: String(users.length + 1),
      name: data.name,
      mobile: data.mobile,
      referralCode,
      referredBy: data.referralCode || '',
      city: data.city || '',
      role: data.role,
      isLeader: data.role === 'leader',
      teamSize: 0,
      joinDate: new Date().toISOString().split('T')[0],
    };

    users.push(newUser);
    localStorage.setItem('jwellbox_users', JSON.stringify(users));

    return { success: true, message: 'Registration successful!', user: newUser };
  };

  const login = (mobile: string) => {
    const users = getAllUsers();
    const found =
      DEMO_USERS.find(u => u.mobile === mobile) || users.find(u => u.mobile === mobile);

    if (found) {
      const clean = stripPassword(found);
      setUser(clean);
      localStorage.setItem('jwellbox_current_user', JSON.stringify(clean));
      return { success: true, message: 'Login successful!' };
    }

    return {
      success: false,
      message: 'Mobile number not registered. Please sign up first.',
    };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('jwellbox_current_user');
  };

  const promoteToLeaderIfEligible = (teamSize: number) => {
    if (!user || teamSize < 100) return;
    if (user.isLeader || user.role === 'leader' || user.role === 'admin') {
      // keep teamSize fresh
      if (user.teamSize !== teamSize) {
        const updated = { ...user, teamSize, isLeader: true };
        setUser(updated);
        localStorage.setItem('jwellbox_current_user', JSON.stringify(updated));
      }
      return;
    }
    const updated: RegisteredUser = {
      ...user,
      isLeader: true,
      role: user.role === 'individual' ? 'individual' : 'leader',
      teamSize,
    };
    // Leader can still be a member — keep membership economics; mark leader badge
    if (updated.role !== 'individual') {
      updated.role = 'leader';
    }
    setUser(updated);
    localStorage.setItem('jwellbox_current_user', JSON.stringify(updated));
    const users = getAllUsers().map(u => (u.id === updated.id ? updated : u));
    localStorage.setItem('jwellbox_users', JSON.stringify(users));
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, getAllUsers, promoteToLeaderIfEligible }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
