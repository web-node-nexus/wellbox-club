import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import {
  ensureDemoMembers,
  fetchAllMembers,
  fetchMemberByMobile,
  getMembersCache,
  getMembersCacheError,
  normalizeMobile,
  upsertMember,
} from '../services/memberDb';
import { fetchInvestmentsForUser } from '../services/investmentService';

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
  authReady: boolean;
  dbError: string | null;
  /** OTP must already be verified by the caller — passwordless login */
  login: (mobile: string) => Promise<{ success: boolean; message: string }>;
  register: (data: {
    name: string;
    mobile: string;
    city?: string;
    referralCode?: string;
    role: 'member' | 'leader' | 'individual';
  }) => Promise<{ success: boolean; message: string; user?: RegisteredUser }>;
  logout: () => void;
  getAllUsers: () => RegisteredUser[];
  refreshUsers: () => Promise<void>;
  /** Promote to leader when team hits 100 (leader remains a member too) */
  promoteToLeaderIfEligible: (teamSize: number) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

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

const SESSION_KEY = 'jwellbox_current_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<RegisteredUser | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);

  const refreshUsers = async () => {
    try {
      await fetchAllMembers();
      await ensureDemoMembers(DEMO_USERS);
      await fetchAllMembers();
      setDbError(null);
    } catch (e: any) {
      const msg =
        e?.message ||
        getMembersCacheError() ||
        'Supabase members table missing. Run supabase/schema.sql in SQL Editor.';
      setDbError(msg);
      throw e;
    }
  };

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        await refreshUsers();
      } catch {
        /* dbError already set */
      }

      if (cancelled) return;

      const savedUser = localStorage.getItem(SESSION_KEY);
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser) as RegisteredUser;
          const fresh =
            (await fetchMemberByMobile(parsed.mobile).catch(() => null)) ||
            getMembersCache().find(u => u.id === parsed.id) ||
            parsed;
          setUser(fresh);
          localStorage.setItem(SESSION_KEY, JSON.stringify(fresh));
          await fetchInvestmentsForUser(fresh.id, fresh.mobile).catch(() => undefined);
        } catch {
          localStorage.removeItem(SESSION_KEY);
        }
      }

      if (!cancelled) setAuthReady(true);
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getAllUsers = (): RegisteredUser[] => getMembersCache();

  const register = async (data: {
    name: string;
    mobile: string;
    city?: string;
    referralCode?: string;
    role: 'member' | 'leader' | 'individual';
  }) => {
    const mobile = normalizeMobile(data.mobile);

    try {
      const existing = await fetchMemberByMobile(mobile);
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
          message: `Ye number pehle se hi ${roleLabel} hai. Dobara member nahi ban sakte — Login with OTP use karo.`,
        };
      }

      const referralCode =
        data.role === 'individual'
          ? ''
          : data.name.substring(0, 3).toUpperCase() +
            Math.floor(100 + Math.random() * 900).toString();

      const newUser: RegisteredUser = {
        id: String(Date.now()),
        name: data.name,
        mobile,
        referralCode,
        referredBy: data.referralCode || '',
        city: data.city || '',
        role: data.role,
        isLeader: data.role === 'leader',
        teamSize: 0,
        joinDate: new Date().toISOString().split('T')[0],
      };

      const saved = await upsertMember(newUser);
      return { success: true, message: 'Registration successful!', user: saved };
    } catch (e: any) {
      return {
        success: false,
        message:
          e?.message?.includes('Could not find the table') || e?.code === 'PGRST205'
            ? 'Database tables missing. Supabase SQL Editor me supabase/schema.sql run karo.'
            : e?.message || 'Registration failed. Please try again.',
      };
    }
  };

  const login = async (mobile: string) => {
    const m = normalizeMobile(mobile);

    try {
      const found = await fetchMemberByMobile(m);
      if (!found) {
        return {
          success: false,
          message:
            'Is number ka membership Supabase me nahi mila. Pehle Join Now se register + pay karo — phir kisi bhi browser se login chalega.',
        };
      }

      const clean = await upsertMember(found);
      await fetchInvestmentsForUser(clean.id, m).catch(() => undefined);
      setUser(clean);
      localStorage.setItem(SESSION_KEY, JSON.stringify(clean));
      return { success: true, message: 'Login successful!' };
    } catch (e: any) {
      return {
        success: false,
        message:
          e?.message?.includes('Could not find the table') || e?.code === 'PGRST205'
            ? 'Database tables missing. Supabase SQL Editor me supabase/schema.sql run karo.'
            : e?.message || 'Login failed. Please try again.',
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  const promoteToLeaderIfEligible = (teamSize: number) => {
    if (!user || teamSize < 100) return;
    if (user.isLeader || user.role === 'leader' || user.role === 'admin') {
      if (user.teamSize !== teamSize) {
        const updated = { ...user, teamSize, isLeader: true };
        setUser(updated);
        void upsertMember(updated);
        localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
      }
      return;
    }
    const updated: RegisteredUser = {
      ...user,
      isLeader: true,
      role: user.role === 'individual' ? 'individual' : 'leader',
      teamSize,
    };
    if (updated.role !== 'individual') updated.role = 'leader';
    setUser(updated);
    void upsertMember(updated);
    localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        authReady,
        dbError,
        login,
        register,
        logout,
        getAllUsers,
        refreshUsers,
        promoteToLeaderIfEligible,
      }}
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
