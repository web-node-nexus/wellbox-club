/** Persist join/invest intent across Razorpay redirect */

export type PendingPayment =
  | {
      kind: 'join';
      name: string;
      mobile: string;
      referralCode?: string;
      city?: string;
      role: 'member' | 'leader' | 'individual';
      amount: number;
    }
  | {
      kind: 'register';
      name: string;
      mobile: string;
      referralCode?: string;
      amount: number;
    }
  | {
      kind: 'invest';
      userId: string;
      mobile: string;
      amount: number;
      returnTo: string;
    };

const KEY = 'jb_pending_payment';

export function savePendingPayment(payload: PendingPayment) {
  sessionStorage.setItem(KEY, JSON.stringify(payload));
}

export function loadPendingPayment(): PendingPayment | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PendingPayment;
  } catch {
    return null;
  }
}

export function clearPendingPayment() {
  sessionStorage.removeItem(KEY);
}
