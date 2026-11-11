import { BUSINESS_RULES } from '../data/businessRules';
import type { Investment } from './investmentService';

const REMINDER_DAYS_BEFORE = 5;
const MS_DAY = 24 * 60 * 60 * 1000;

function parseDateOnly(iso: string): Date {
  const d = new Date(iso.includes('T') ? iso : `${iso}T00:00:00`);
  return Number.isNaN(d.getTime()) ? new Date() : d;
}

function ymd(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Same calendar day next month (clamps to month end). */
export function addOneMonth(from: Date): Date {
  const d = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const day = d.getDate();
  d.setMonth(d.getMonth() + 1);
  if (d.getDate() < day) d.setDate(0); // last day of previous month
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Next monthly contribution due date:
 * - After last investment → +1 month on that calendar day
 * - Else after join date → +1 month from join
 */
export function getNextContributionDueDate(opts: {
  joinDate: string;
  investments: Investment[];
  now?: Date;
}): Date {
  const now = opts.now || new Date();
  now.setHours(0, 0, 0, 0);

  const sorted = [...opts.investments].sort(
    (a, b) => parseDateOnly(b.date).getTime() - parseDateOnly(a.date).getTime()
  );
  const last = sorted[0];
  const anchor = last ? parseDateOnly(last.date) : parseDateOnly(opts.joinDate);
  anchor.setHours(0, 0, 0, 0);

  let due = addOneMonth(anchor);
  // If somehow still in the past (clock skew / same-day), keep advancing
  while (due.getTime() < now.getTime()) {
    due = addOneMonth(due);
  }
  return due;
}

export function getSuggestedContributionAmount(investments: Investment[]): number {
  const sorted = [...investments].sort(
    (a, b) => parseDateOnly(b.date).getTime() - parseDateOnly(a.date).getTime()
  );
  if (sorted[0]?.amount) return Number(sorted[0].amount);
  return BUSINESS_RULES.defaultJoinInvestment;
}

export function daysUntilDue(due: Date, now = new Date()): number {
  const a = new Date(now);
  a.setHours(0, 0, 0, 0);
  const b = new Date(due);
  b.setHours(0, 0, 0, 0);
  return Math.ceil((b.getTime() - a.getTime()) / MS_DAY);
}

/** True when due is today or within the next REMINDER_DAYS_BEFORE days. */
export function isInPaymentReminderWindow(due: Date, now = new Date()): boolean {
  const days = daysUntilDue(due, now);
  return days >= 0 && days <= REMINDER_DAYS_BEFORE;
}

export function reminderWindowMeta(due: Date, amount: number, now = new Date()) {
  const days = daysUntilDue(due, now);
  return {
    dueDate: ymd(due),
    amount,
    daysLeft: days,
    inWindow: isInPaymentReminderWindow(due, now),
    reminderDaysBefore: REMINDER_DAYS_BEFORE,
  };
}

export { REMINDER_DAYS_BEFORE };
