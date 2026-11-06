import { supabase, isSupabaseConfigured } from '../lib/supabase';

export type NotificationAudience = 'admin' | 'user';

export type NotificationType =
  | 'member_joined'
  | 'investment'
  | 'commission'
  | 'withdrawal'
  | 'gold_order'
  | 'info';

export type AppNotification = {
  id: string;
  audience: NotificationAudience;
  userId: string | null;
  type: NotificationType;
  title: string;
  message: string;
  meta: Record<string, unknown>;
  read: boolean;
  createdAt: string;
};

type DbNotification = {
  id: string;
  audience: NotificationAudience;
  user_id: string | null;
  type: string;
  title: string;
  message: string;
  meta: Record<string, unknown> | null;
  read: boolean;
  created_at: string;
};

function rowToNotification(row: DbNotification): AppNotification {
  return {
    id: row.id,
    audience: row.audience,
    userId: row.user_id,
    type: row.type as NotificationType,
    title: row.title,
    message: row.message,
    meta: (row.meta || {}) as Record<string, unknown>,
    read: Boolean(row.read),
    createdAt: row.created_at,
  };
}

/** Browser toast when admin tab is open (requires permission) */
export function maybeShowBrowserNotification(title: string, body: string) {
  try {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    if (Notification.permission !== 'granted') return;
    new Notification(title, { body, icon: '/favicon.ico' });
  } catch {
    /* ignore */
  }
}

export async function requestBrowserNotificationPermission() {
  try {
    if (typeof window === 'undefined' || !('Notification' in window)) return 'denied';
    if (Notification.permission === 'granted') return 'granted';
    if (Notification.permission === 'denied') return 'denied';
    return await Notification.requestPermission();
  } catch {
    return 'denied';
  }
}

export async function createNotification(input: {
  audience: NotificationAudience;
  userId?: string | null;
  type: NotificationType;
  title: string;
  message: string;
  meta?: Record<string, unknown>;
}): Promise<AppNotification | null> {
  const rec: AppNotification = {
    id: `ntf_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
    audience: input.audience,
    userId: input.userId || null,
    type: input.type,
    title: input.title,
    message: input.message,
    meta: input.meta || {},
    read: false,
    createdAt: new Date().toISOString(),
  };

  if (!isSupabaseConfigured) return rec;

  const { data, error } = await supabase
    .from('notifications')
    .insert({
      id: rec.id,
      audience: rec.audience,
      user_id: rec.userId,
      type: rec.type,
      title: rec.title,
      message: rec.message,
      meta: rec.meta,
      read: false,
      created_at: rec.createdAt,
    })
    .select('*')
    .single();

  if (error) {
    console.error('createNotification failed', error.message);
    return null;
  }

  const saved = rowToNotification(data as DbNotification);
  if (saved.audience === 'admin') {
    maybeShowBrowserNotification(saved.title, saved.message);
  }
  return saved;
}

/** Never throw — used from join / pay / commission paths */
export async function notifyAdmin(input: {
  type: NotificationType;
  title: string;
  message: string;
  meta?: Record<string, unknown>;
}) {
  try {
    await createNotification({
      audience: 'admin',
      type: input.type,
      title: input.title,
      message: input.message,
      meta: input.meta,
    });
  } catch (e) {
    console.warn('notifyAdmin skipped', e);
  }
}

export async function notifyUser(
  userId: string,
  input: {
    type: NotificationType;
    title: string;
    message: string;
    meta?: Record<string, unknown>;
  }
) {
  try {
    await createNotification({
      audience: 'user',
      userId,
      type: input.type,
      title: input.title,
      message: input.message,
      meta: input.meta,
    });
  } catch (e) {
    console.warn('notifyUser skipped', e);
  }
}

export async function fetchAdminNotifications(limit = 100): Promise<AppNotification[]> {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('audience', 'admin')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    if (/Could not find the table|PGRST205|notifications/i.test(error.message)) {
      throw new Error(
        'Notifications table missing. Run supabase/notifications_migration.sql in Supabase SQL Editor.'
      );
    }
    throw error;
  }
  return ((data || []) as DbNotification[]).map(rowToNotification);
}

export async function fetchUserNotifications(
  userId: string,
  limit = 100
): Promise<AppNotification[]> {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('audience', 'user')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    if (/Could not find the table|PGRST205|notifications/i.test(error.message)) {
      return [];
    }
    throw error;
  }
  return ((data || []) as DbNotification[]).map(rowToNotification);
}

export async function countUnreadAdmin(): Promise<number> {
  if (!isSupabaseConfigured) return 0;
  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('audience', 'admin')
    .eq('read', false);

  if (error) return 0;
  return count || 0;
}

export async function markNotificationRead(id: string) {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.from('notifications').update({ read: true }).eq('id', id);
  if (error) throw error;
}

export async function markAllAdminNotificationsRead() {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('audience', 'admin')
    .eq('read', false);
  if (error) throw error;
}

export async function markAllUserNotificationsRead(userId: string) {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('audience', 'user')
    .eq('user_id', userId)
    .eq('read', false);
  if (error) throw error;
}

export async function deleteNotification(id: string) {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.from('notifications').delete().eq('id', id);
  if (error) throw error;
}

export function formatNotificationTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString('en-IN');
}
