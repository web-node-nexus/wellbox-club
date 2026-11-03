/**
 * Compatibility layer — membership lives in Supabase (`members` table).
 * Sync helpers read the in-memory cache filled by AuthProvider.
 */
import type { RegisteredUser } from '../context/AuthContext';
import {
  fetchMemberByMobile,
  getMembersCache,
  normalizeMobile,
  upsertMember,
  upsertMembersCache,
} from './memberDb';

export { normalizeMobile };

export function saveMembershipSnapshot(user: RegisteredUser) {
  upsertMembersCache(user);
}

export function getMembershipByMobile(mobile: string): RegisteredUser | null {
  const m = normalizeMobile(mobile);
  return getMembersCache().find(u => normalizeMobile(u.mobile) === m) || null;
}

export async function getMembershipByMobileAsync(mobile: string): Promise<RegisteredUser | null> {
  return fetchMemberByMobile(mobile);
}

export function upsertUserInList(user: RegisteredUser) {
  upsertMembersCache(user);
  // Fire-and-forget persist (callers that need certainty should await upsertMember)
  void upsertMember(user).catch(err => console.error('upsertUserInList failed', err));
  return { ...user, mobile: normalizeMobile(user.mobile) };
}

export async function upsertUserInListAsync(user: RegisteredUser) {
  return upsertMember(user);
}

export function listAllStoredUsers(): RegisteredUser[] {
  return getMembersCache();
}
