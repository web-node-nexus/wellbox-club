import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import {
  fetchAllMembers,
  fetchMemberByMobile,
  getMembersCache,
  getMembersCacheError,
  normalizeMobile,
  upsertMember,
} from '../services/memberDb';
import { fetchInvestmentsForUser, fetchInvestmentsForUsers } from '../services/investmentService';
import {
  backfillCommissionsFromInvestments,
  fetchCommissions,
  getTeamTreeIds,
  refreshUplineTeamSizes,
  syncLeaderPayout,
} from '../services/commissionService';
import { ADMIN_FALLBACK_USER, isAdminMobile } from '../services/otpService';

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
  /** Saved payout details for commission withdrawals */
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  accountHolder?: string;
  upiId?: string;
}

interface AuthContextType {
  user: RegisteredUser | null;
  authReady: boolean;
  dbError: string | null;
  /** Bumps when members cache is reloaded — use as React dependency for team lists */
  membersTick: number;
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
  /** Persist profile / bank-UPI payout details */
  updateProfile: (patch: Partial<RegisteredUser>) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const SESSION_KEY = 'jwellbox_current_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<RegisteredUser | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);
  const [membersTick, setMembersTick] = useState(0);

  const bumpMembers = useCallback(() => setMembersTick(t => t + 1), []);

  const refreshUsers = useCallback(async () => {
    try {
      await fetchAllMembers();
      setDbError(null);
      bumpMembers();
    } catch (e: any) {
      const msg =
        e?.message ||
        getMembersCacheError() ||
        'Supabase members table missing. Run supabase/schema.sql in SQL Editor.';
      setDbError(msg);
      throw e;
    }
  }, [bumpMembers]);

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

  const getAllUsers = useCallback((): RegisteredUser[] => getMembersCache(), []);

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
          message: `This number is already registered as ${roleLabel}. Please use Login with OTP.`,
        };
      }

      const referralCode =
        data.role === 'individual'
          ? ''
          : data.name.substring(0, 3).toUpperCase() +
            Math.floor(100 + Math.random() * 900).toString();

      // Normalize sponsor: store their referral CODE so L1/L2 lookup stays stable
      const rawSponsor = (data.referralCode || '').trim().toUpperCase();
      let referredBy = '';
      if (rawSponsor) {
        await fetchAllMembers().catch(() => undefined);
        const sponsor = getMembersCache().find(
          u =>
            u.referralCode?.toUpperCase() === rawSponsor ||
            u.id === rawSponsor ||
            u.mobile === rawSponsor
        );
        if (sponsor?.referralCode) referredBy = sponsor.referralCode.toUpperCase();
        else if (sponsor) referredBy = sponsor.id;
        else {
          // Invalid / unknown code — refuse so orphan referrals don't silently lose L1
          return {
            success: false,
            message: `Referral code "${rawSponsor}" not found. Check the code or leave it blank.`,
          };
        }
      }

      const newUser: RegisteredUser = {
        id: String(Date.now()),
        name: data.name,
        mobile,
        referralCode,
        referredBy,
        city: data.city || '',
        role: data.role,
        isLeader: data.role === 'leader',
        teamSize: 0,
        joinDate: new Date().toISOString().split('T')[0],
      };

      const saved = await upsertMember(newUser);
      bumpMembers();
      // Grow upline team size / leader eligibility immediately on join
      await refreshUplineTeamSizes(saved).catch(() => undefined);
      bumpMembers();
      try {
        const { notifyAdmin, notifyUser } = await import('../services/notificationService');
        await notifyAdmin({
          type: 'member_joined',
          title: 'New member joined',
          message: `${saved.name} (${saved.mobile}) joined as ${saved.role}`,
          meta: { userId: saved.id, mobile: saved.mobile, role: saved.role },
        });
        await notifyUser(saved.id, {
          type: 'info',
          title: 'Welcome to Jewellbox Club',
          message: 'Your account was created successfully.',
          meta: { role: saved.role },
        });
      } catch {
        /* non-blocking */
      }
      return { success: true, message: 'Registration successful!', user: saved };
    } catch (e: any) {
      return {
        success: false,
        message:
          e?.message?.includes('Could not find the table') || e?.code === 'PGRST205'
            ? 'Database tables missing. Run supabase/schema.sql in the Supabase SQL Editor.'
            : e?.message || 'Registration failed. Please try again.',
      };
    }
  };

  const login = async (mobile: string) => {
    const m = normalizeMobile(mobile);

    const finishLogin = async (user: RegisteredUser, soft = false) => {
      let clean = user;
      if (!soft) {
        try {
          clean = await upsertMember(user);
        } catch {
          clean = user;
        }
      }
      // Reload full roster so My Team / admin lists see referrals signed up elsewhere
      await fetchAllMembers().catch(() => undefined);
      bumpMembers();
      await fetchInvestmentsForUser(clean.id, m).catch(() => undefined);
      await fetchCommissions().catch(() => undefined);
      await backfillCommissionsFromInvestments().catch(() => undefined);
      await fetchCommissions(clean.id).catch(() => undefined);
      const teamIds = getTeamTreeIds(clean.id);
      await fetchInvestmentsForUsers([clean.id, ...teamIds]).catch(() => undefined);
      await syncLeaderPayout(clean).catch(() => undefined);
      const refreshed = soft
        ? clean
        : (await fetchMemberByMobile(m).catch(() => null)) || clean;
      setUser(refreshed);
      localStorage.setItem(SESSION_KEY, JSON.stringify(refreshed));
      return { success: true as const, message: 'Login successful!' };
    };

    try {
      let found: RegisteredUser | null = null;
      try {
        found = await fetchMemberByMobile(m);
      } catch (lookupErr: any) {
        // Production often fails if Vercel env missing — admin can still enter
        if (isAdminMobile(m)) {
          return finishLogin({ ...ADMIN_FALLBACK_USER }, true);
        }
        const msg = lookupErr?.message || '';
        if (/failed to fetch|networkerror|fetch/i.test(msg)) {
          return {
            success: false,
            message:
              'Could not reach the server. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY on Vercel, then redeploy.',
          };
        }
        throw lookupErr;
      }

      if (!found) {
        if (isAdminMobile(m)) {
          // Ensure admin row exists when DB is reachable but empty
          try {
            const seeded = await upsertMember({ ...ADMIN_FALLBACK_USER });
            return finishLogin(seeded);
          } catch {
            return finishLogin({ ...ADMIN_FALLBACK_USER }, true);
          }
        }
        return {
          success: false,
          message:
            'No membership found for this number. Please Join Now (register + pay), then login from any browser.',
        };
      }

      return finishLogin(found);
    } catch (e: any) {
      if (isAdminMobile(m)) {
        return finishLogin({ ...ADMIN_FALLBACK_USER }, true);
      }
      return {
        success: false,
        message:
          e?.message?.includes('Could not find the table') || e?.code === 'PGRST205'
            ? 'Database tables missing. Run supabase/schema.sql in the Supabase SQL Editor.'
            : /failed to fetch/i.test(e?.message || '')
              ? 'Could not reach the server. Check Supabase keys in Vercel environment variables.'
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

  const updateProfile = async (patch: Partial<RegisteredUser>) => {
    if (!user) return { success: false, message: 'Not logged in' };
    try {
      const saved = await upsertMember({ ...user, ...patch, mobile: user.mobile, id: user.id });
      setUser(saved);
      localStorage.setItem(SESSION_KEY, JSON.stringify(saved));
      bumpMembers();
      return { success: true, message: 'Profile saved' };
    } catch (e: any) {
      return {
        success: false,
        message:
          e?.message?.includes('bank_name') || /column.*does not exist/i.test(e?.message || '')
            ? 'Payout columns missing. Run supabase/withdrawals_migration.sql in Supabase SQL Editor.'
            : e?.message || 'Could not save profile',
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        authReady,
        dbError,
        membersTick,
        login,
        register,
        logout,
        getAllUsers,
        refreshUsers,
        promoteToLeaderIfEligible,
        updateProfile,
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
