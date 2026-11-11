import { requestBrowserNotificationPermission } from './notificationService';

const SW_PATH = '/sw.js';

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

export function pushSupported() {
  return (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  );
}

export async function fetchVapidPublicKey(): Promise<string | null> {
  const fromEnv = import.meta.env.VITE_VAPID_PUBLIC_KEY as string | undefined;
  if (fromEnv) return fromEnv;
  try {
    const res = await fetch('/api/vapid-public-key');
    const data = await res.json().catch(() => ({}));
    return data?.publicKey || null;
  } catch {
    return null;
  }
}

export async function ensureServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!pushSupported()) return null;
  try {
    return await navigator.serviceWorker.register(SW_PATH);
  } catch (e) {
    console.warn('SW register failed', e);
    return null;
  }
}

/** Ask permission + save Web Push subscription for payment reminders */
export async function enablePaymentPushReminders(userId: string): Promise<{
  ok: boolean;
  message: string;
}> {
  if (!userId) return { ok: false, message: 'Not logged in' };
  if (!pushSupported()) {
    return { ok: false, message: 'Push not supported on this browser' };
  }

  const perm = await requestBrowserNotificationPermission();
  if (perm !== 'granted') {
    return { ok: false, message: 'Notification permission denied' };
  }

  const reg = await ensureServiceWorker();
  if (!reg) return { ok: false, message: 'Could not register service worker' };

  await navigator.serviceWorker.ready;

  const publicKey = await fetchVapidPublicKey();
  if (!publicKey) {
    return { ok: false, message: 'VAPID public key missing on server' };
  }

  let sub = await reg.pushManager.getSubscription();
  if (!sub) {
    sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    });
  }

  const res = await fetch('/api/push-subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId,
      subscription: sub.toJSON(),
      userAgent: navigator.userAgent,
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return { ok: false, message: data?.error || 'Could not save push subscription' };
  }

  localStorage.setItem('jb_push_enabled', '1');
  localStorage.setItem('jb_push_user', userId);
  return { ok: true, message: 'Payment push reminders enabled' };
}

/** Soft auto-enable once after login (no spam if denied) */
export async function maybeAutoEnablePush(userId: string) {
  if (!userId || !pushSupported()) return;
  if (localStorage.getItem('jb_push_denied') === '1') return;
  if (
    localStorage.getItem('jb_push_enabled') === '1' &&
    localStorage.getItem('jb_push_user') === userId
  ) {
    // Refresh subscription quietly
    try {
      await enablePaymentPushReminders(userId);
    } catch {
      /* ignore */
    }
    return;
  }

  // Only auto-prompt once per browser
  if (localStorage.getItem('jb_push_asked') === '1') return;
  localStorage.setItem('jb_push_asked', '1');

  const result = await enablePaymentPushReminders(userId);
  if (!result.ok && /denied/i.test(result.message)) {
    localStorage.setItem('jb_push_denied', '1');
  }
}
