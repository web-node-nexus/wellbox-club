export interface Investment {
  id: string;
  userId: string;
  amount: number;
  date: string;
  lockedUntil: string;
  status: 'locked' | 'unlocked' | 'used';
  paymentId?: string;
}

export interface GoldOrderRecord {
  id: string;
  userId: string;
  userName: string;
  userMobile: string;
  designId: string;
  designName: string;
  weightGrams: number;
  amount: number;
  status: 'pending' | 'confirmed' | 'delivered';
  createdAt: string;
  investmentIds: string[];
}

const investmentsKey = (userId: string) => `investments_${userId}`;
const GOLD_ORDERS_KEY = 'jwellbox_gold_orders';

function addMonths(date: Date, months: number) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

function refreshStatus(inv: Investment): Investment {
  if (inv.status === 'used') return inv;
  const unlocked = new Date() >= new Date(inv.lockedUntil);
  return { ...inv, status: unlocked ? 'unlocked' : 'locked' };
}

export function getInvestments(userId: string): Investment[] {
  try {
    const raw = JSON.parse(localStorage.getItem(investmentsKey(userId)) || '[]') as Investment[];
    const refreshed = raw.map(refreshStatus);
    localStorage.setItem(investmentsKey(userId), JSON.stringify(refreshed));
    return refreshed;
  } catch {
    return [];
  }
}

export function addInvestment(
  userId: string,
  amount: number,
  paymentId?: string
): Investment {
  const now = new Date();
  const inv: Investment = {
    id: `inv_${Date.now()}`,
    userId,
    amount,
    date: now.toISOString().split('T')[0],
    lockedUntil: addMonths(now, 12).toISOString().split('T')[0],
    status: 'locked',
    paymentId,
  };
  const list = getInvestments(userId);
  list.push(inv);
  localStorage.setItem(investmentsKey(userId), JSON.stringify(list));
  return inv;
}

export function getTotalInvested(userId: string): number {
  return getInvestments(userId)
    .filter(i => i.status !== 'used')
    .reduce((s, i) => s + i.amount, 0);
}

export function getLockedInvested(userId: string): number {
  return getInvestments(userId)
    .filter(i => i.status === 'locked')
    .reduce((s, i) => s + i.amount, 0);
}

export function getUnlockedInvested(userId: string): number {
  return getInvestments(userId)
    .filter(i => i.status === 'unlocked')
    .reduce((s, i) => s + i.amount, 0);
}

/** Spend unlocked investment on a gold order (FIFO). Returns false if insufficient. */
export function spendUnlockedInvestment(
  userId: string,
  amount: number
): { success: boolean; investmentIds: string[]; message: string } {
  const list = getInvestments(userId);
  let remaining = amount;
  const usedIds: string[] = [];

  for (const inv of list) {
    if (remaining <= 0) break;
    if (inv.status !== 'unlocked') continue;
    usedIds.push(inv.id);
    remaining -= inv.amount;
    inv.status = 'used';
  }

  if (remaining > 0) {
    return {
      success: false,
      investmentIds: [],
      message: 'Insufficient unlocked investment for this gold order',
    };
  }

  localStorage.setItem(investmentsKey(userId), JSON.stringify(list));
  return { success: true, investmentIds: usedIds, message: 'OK' };
}

export function getGoldOrders(): GoldOrderRecord[] {
  try {
    return JSON.parse(localStorage.getItem(GOLD_ORDERS_KEY) || '[]');
  } catch {
    return [];
  }
}

export function saveGoldOrder(order: GoldOrderRecord) {
  const orders = getGoldOrders();
  orders.unshift(order);
  localStorage.setItem(GOLD_ORDERS_KEY, JSON.stringify(orders));
}

export function getUserGoldOrders(userId: string) {
  return getGoldOrders().filter(o => o.userId === userId);
}
