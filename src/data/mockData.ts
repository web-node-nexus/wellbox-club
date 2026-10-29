// Mock data for Jwellbox Club Platform

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  referralCode: string;
  referredBy: string | null;
  isLeader: boolean;
  teamSize: number;
  joinDate: string;
  avatar?: string;
}

export interface Contribution {
  id: string;
  userId: string;
  amount: number;
  date: string;
  lockedUntil: string;
  status: 'locked' | 'unlocked';
}

export interface WalletTransaction {
  id: string;
  userId: string;
  type: 'commission_l1' | 'commission_l2' | 'leader_payout' | 'gold_order_commission' | 'contribution' | 'withdrawal' | 'gold_purchase';
  amount: number;
  wallet: 'commission' | 'contribution';
  description: string;
  sourceUserId?: string;
  status: 'completed' | 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface GoldDesign {
  id: string;
  name: string;
  category: string;
  weightGrams: number;
  purity: '22K' | '24K';
  makingCharges: string;
  images: string[];
  description: string;
}

export interface GoldLead {
  id: string;
  userId: string;
  designId: string;
  status: 'new' | 'contacted' | 'converted';
  createdAt: string;
}

export interface GoldOrder {
  id: string;
  userId: string;
  designId: string;
  amount: number;
  referredByUserId?: string;
  commission: number;
  status: 'pending' | 'confirmed' | 'delivered';
  createdAt: string;
}

export interface Withdrawal {
  id: string;
  userId: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  processedAt?: string;
}

export interface Settings {
  level1Commission: number;
  level2Commission: number;
  leaderCommission: number;
  goldOrderCommission: number;
  lockPeriodMonths: number;
}

// Settings (configurable by admin)
export const appSettings: Settings = {
  level1Commission: 10,
  level2Commission: 5,
  leaderCommission: 5,
  goldOrderCommission: 4,
  lockPeriodMonths: 12,
};

// Users
export const users: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@jwellbox.com', phone: '+91 9876543210', referralCode: 'ADMIN001', referredBy: null, isLeader: true, teamSize: 250, joinDate: '2023-01-01' },
  { id: '2', name: 'Rajesh Kumar', email: 'rajesh@example.com', phone: '+91 9876543211', referralCode: 'RAJ002', referredBy: '1', isLeader: true, teamSize: 120, joinDate: '2023-03-15' },
  { id: '3', name: 'Priya Sharma', email: 'priya@example.com', phone: '+91 9876543212', referralCode: 'PRI003', referredBy: '2', isLeader: false, teamSize: 45, joinDate: '2023-05-20' },
  { id: '4', name: 'Amit Patel', email: 'amit@example.com', phone: '+91 9876543213', referralCode: 'AMI004', referredBy: '2', isLeader: false, teamSize: 12, joinDate: '2023-06-10' },
  { id: '5', name: 'Sunita Devi', email: 'sunita@example.com', phone: '+91 9876543214', referralCode: 'SUN005', referredBy: '3', isLeader: false, teamSize: 5, joinDate: '2023-08-01' },
  { id: '6', name: 'Vikram Singh', email: 'vikram@example.com', phone: '+91 9876543215', referralCode: 'VIK006', referredBy: '1', isLeader: false, teamSize: 30, joinDate: '2023-07-15' },
  { id: '7', name: 'Meena Joshi', email: 'meena@example.com', phone: '+91 9876543216', referralCode: 'MEE007', referredBy: '6', isLeader: false, teamSize: 8, joinDate: '2023-09-01' },
  { id: '8', name: 'Deepak Verma', email: 'deepak@example.com', phone: '+91 9876543217', referralCode: 'DEE008', referredBy: '4', isLeader: false, teamSize: 3, joinDate: '2024-01-10' },
  { id: '9', name: 'Sub Admin', email: 'subadmin@jwellbox.com', phone: '+91 9876543218', referralCode: 'SUB009', referredBy: null, isLeader: false, teamSize: 0, joinDate: '2023-02-01' },
];

// Audit Logs
export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}

export const auditLogs: AuditLog[] = [
  { id: 'al1', userId: '1', action: 'LOGIN', details: 'Admin logged in', ipAddress: '192.168.1.100', timestamp: '2024-06-15 10:30:00' },
  { id: 'al2', userId: '1', action: 'APPROVE_WITHDRAWAL', details: 'Approved withdrawal w1 for ₹1,000', ipAddress: '192.168.1.100', timestamp: '2024-06-15 11:00:00' },
  { id: 'al3', userId: '1', action: 'UPDATE_SETTINGS', details: 'Updated commission rates', ipAddress: '192.168.1.100', timestamp: '2024-06-14 15:20:00' },
  { id: 'al4', userId: '1', action: 'ADD_GOLD_DESIGN', details: 'Added new gold design: Royal Necklace Set', ipAddress: '192.168.1.100', timestamp: '2024-06-14 14:00:00' },
  { id: 'al5', userId: '1', action: 'PROMOTE_LEADER', details: 'Promoted user 2 to Leader', ipAddress: '192.168.1.100', timestamp: '2024-06-13 09:00:00' },
];

// Contributions
export const contributions: Contribution[] = [
  { id: 'c1', userId: '2', amount: 5000, date: '2024-01-15', lockedUntil: '2025-01-15', status: 'locked' },
  { id: 'c2', userId: '2', amount: 5000, date: '2024-02-15', lockedUntil: '2025-02-15', status: 'locked' },
  { id: 'c3', userId: '3', amount: 3000, date: '2023-06-20', lockedUntil: '2024-06-20', status: 'unlocked' },
  { id: 'c4', userId: '3', amount: 3000, date: '2024-03-20', lockedUntil: '2025-03-20', status: 'locked' },
  { id: 'c5', userId: '4', amount: 2000, date: '2024-04-10', lockedUntil: '2025-04-10', status: 'locked' },
  { id: 'c6', userId: '5', amount: 1000, date: '2024-05-01', lockedUntil: '2025-05-01', status: 'locked' },
  { id: 'c7', userId: '6', amount: 5000, date: '2023-08-15', lockedUntil: '2024-08-15', status: 'unlocked' },
  { id: 'c8', userId: '7', amount: 2000, date: '2024-06-01', lockedUntil: '2025-06-01', status: 'locked' },
];

// Wallet Transactions (Ledger)
export const walletTransactions: WalletTransaction[] = [
  { id: 't1', userId: '2', type: 'commission_l1', amount: 500, wallet: 'commission', description: 'Commission from Priya Sharma (L1)', sourceUserId: '3', status: 'completed', createdAt: '2024-03-20' },
  { id: 't2', userId: '2', type: 'commission_l1', amount: 200, wallet: 'commission', description: 'Commission from Amit Patel (L1)', sourceUserId: '4', status: 'completed', createdAt: '2024-04-10' },
  { id: 't3', userId: '2', type: 'commission_l2', amount: 50, wallet: 'commission', description: 'Commission from Sunita Devi (L2)', sourceUserId: '5', status: 'completed', createdAt: '2024-05-01' },
  { id: 't4', userId: '1', type: 'commission_l1', amount: 500, wallet: 'commission', description: 'Commission from Rajesh Kumar (L1)', sourceUserId: '2', status: 'completed', createdAt: '2024-01-15' },
  { id: 't5', userId: '1', type: 'commission_l1', amount: 500, wallet: 'commission', description: 'Commission from Vikram Singh (L1)', sourceUserId: '6', status: 'completed', createdAt: '2024-07-15' },
  { id: 't6', userId: '1', type: 'leader_payout', amount: 2500, wallet: 'commission', description: 'Leader monthly payout - January 2024', status: 'completed', createdAt: '2024-02-03' },
  { id: 't7', userId: '2', type: 'leader_payout', amount: 1800, wallet: 'commission', description: 'Leader monthly payout - January 2024', status: 'completed', createdAt: '2024-02-03' },
  { id: 't8', userId: '3', type: 'commission_l1', amount: 100, wallet: 'commission', description: 'Commission from Sunita Devi (L1)', sourceUserId: '5', status: 'completed', createdAt: '2024-05-01' },
  { id: 't9', userId: '2', type: 'gold_order_commission', amount: 450, wallet: 'commission', description: 'Gold order commission - Necklace Set', status: 'completed', createdAt: '2024-06-15' },
  { id: 't10', userId: '3', type: 'contribution', amount: 3000, wallet: 'contribution', description: 'Monthly contribution - June 2023', status: 'completed', createdAt: '2023-06-20' },
  { id: 't11', userId: '2', type: 'contribution', amount: 5000, wallet: 'contribution', description: 'Monthly contribution - January 2024', status: 'completed', createdAt: '2024-01-15' },
];

// Gold Designs
export const goldDesigns: GoldDesign[] = [
  { id: 'g1', name: 'Royal Necklace Set', category: 'Necklace', weightGrams: 45.5, purity: '22K', makingCharges: '₹800/gram', images: [], description: 'Exquisite traditional necklace set with intricate kundan work. Perfect for weddings and special occasions.' },
  { id: 'g2', name: 'Antique Bangles Pair', category: 'Bangles', weightGrams: 28.0, purity: '22K', makingCharges: '₹600/gram', images: [], description: 'Beautiful antique finish bangles with traditional motifs. Lightweight and comfortable for daily wear.' },
  { id: 'g3', name: 'Diamond Cut Chain', category: 'Chain', weightGrams: 15.2, purity: '22K', makingCharges: '₹500/gram', images: [], description: 'Stunning diamond cut gold chain with brilliant shine. Modern design suitable for all occasions.' },
  { id: 'g4', name: 'Temple Jewelry Set', category: 'Set', weightGrams: 120.0, purity: '22K', makingCharges: '₹1200/gram', images: [], description: 'Complete temple jewelry set including necklace, earrings, and maang tikka. Handcrafted by master artisans.' },
  { id: 'g5', name: 'Minimalist Ring', category: 'Ring', weightGrams: 4.8, purity: '24K', makingCharges: '₹400/gram', images: [], description: 'Elegant minimalist ring in pure 24K gold. Perfect for everyday wear with a modern touch.' },
  { id: 'g6', name: 'Jhumka Earrings', category: 'Earrings', weightGrams: 18.5, purity: '22K', makingCharges: '₹700/gram', images: [], description: 'Traditional jhumka earrings with pearl drops. Classic design that never goes out of style.' },
  { id: 'g7', name: 'Gold Coin 10g', category: 'Coins', weightGrams: 10.0, purity: '24K', makingCharges: '₹200/gram', images: [], description: 'Pure 24K gold coin, ideal for investment and gifting. BIS hallmarked certified.' },
  { id: 'g8', name: 'Bridal Choker', category: 'Necklace', weightGrams: 85.0, purity: '22K', makingCharges: '₹1500/gram', images: [], description: 'Magnificent bridal choker with precious stone embedding. A statement piece for your special day.' },
];

// Gold Leads
export const goldLeads: GoldLead[] = [
  { id: 'l1', userId: '3', designId: 'g1', status: 'new', createdAt: '2024-06-10' },
  { id: 'l2', userId: '5', designId: 'g4', status: 'contacted', createdAt: '2024-06-12' },
  { id: 'l3', userId: '7', designId: 'g6', status: 'new', createdAt: '2024-06-15' },
];

// Gold Orders
export const goldOrders: GoldOrder[] = [
  { id: 'o1', userId: '3', designId: 'g1', amount: 45500, referredByUserId: '2', commission: 1365, status: 'confirmed', createdAt: '2024-06-15' },
  { id: 'o2', userId: '5', designId: 'g5', amount: 28800, referredByUserId: '3', commission: 864, status: 'delivered', createdAt: '2024-05-20' },
];

// Withdrawals
export const withdrawals: Withdrawal[] = [
  { id: 'w1', userId: '2', amount: 1000, status: 'approved', createdAt: '2024-05-01', processedAt: '2024-05-03' },
  { id: 'w2', userId: '3', amount: 500, status: 'pending', createdAt: '2024-06-10' },
  { id: 'w3', userId: '1', amount: 3000, status: 'approved', createdAt: '2024-04-15', processedAt: '2024-04-17' },
];

// Helper functions
export function getCommissionWalletBalance(userId: string): number {
  return walletTransactions
    .filter(t => t.userId === userId && t.wallet === 'commission' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0)
    - withdrawals
      .filter(w => w.userId === userId && w.status !== 'rejected')
      .reduce((sum, w) => sum + w.amount, 0);
}

export function getContributionWalletBalance(userId: string): number {
  return walletTransactions
    .filter(t => t.userId === userId && t.wallet === 'contribution' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);
}

export function getDirectReferrals(userId: string): User[] {
  return users.filter(u => u.referredBy === userId);
}

export function getTeamSize(userId: string): number {
  let count = 0;
  const queue = [userId];
  const visited = new Set<string>();
  while (queue.length > 0) {
    const current = queue.shift()!;
    if (visited.has(current)) continue;
    visited.add(current);
    const directRefs = users.filter(u => u.referredBy === current);
    count += directRefs.length;
    directRefs.forEach(u => queue.push(u.id));
  }
  return count;
}

export function getUserById(id: string): User | undefined {
  return users.find(u => u.id === id);
}
