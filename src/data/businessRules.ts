/** Jewellbox Club — actual business concept */

export const BUSINESS_RULES = {
  /** Direct referral contribution commission */
  level1Percent: 10,
  /** Second-level referral contribution commission */
  level2Percent: 5,
  /** Leader share of team total income (after 100 members) */
  leaderPercent: 5,
  /** Gold order referral commission */
  goldOrderPercent: 3,
  /** Team size required to become / earn as Leader */
  leaderTeamRequirement: 100,
  /** Leader payout day of month */
  leaderPayoutDay: 3,
  /** Contribution / investment lock months */
  lockMonths: 12,
  /** Minimum first / monthly contribution to become a member */
  minJoinInvestment: 1000,
  /** Prefill amount on Join / Register (user can raise; no max) */
  defaultJoinInvestment: 10000,
} as const;

export function formatInr(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function nextLeaderPayoutDate(from = new Date()) {
  const d = new Date(from);
  let year = d.getFullYear();
  let month = d.getMonth();
  let payout = new Date(year, month, BUSINESS_RULES.leaderPayoutDay, 10, 0, 0);
  if (d >= payout) {
    month += 1;
    if (month > 11) {
      month = 0;
      year += 1;
    }
    payout = new Date(year, month, BUSINESS_RULES.leaderPayoutDay, 10, 0, 0);
  }
  return payout;
}

export function daysUntil(date: Date, from = new Date()) {
  return Math.max(0, Math.ceil((date.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)));
}
