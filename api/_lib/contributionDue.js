const DEFAULT_AMOUNT = 10000;
const REMINDER_DAYS_BEFORE = 5;
const MS_DAY = 24 * 60 * 60 * 1000;

function parseDateOnly(iso) {
  const d = new Date(String(iso).includes('T') ? iso : `${iso}T00:00:00`);
  return Number.isNaN(d.getTime()) ? new Date() : d;
}

export function addOneMonth(from) {
  const d = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const day = d.getDate();
  d.setMonth(d.getMonth() + 1);
  if (d.getDate() < day) d.setDate(0);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function getNextContributionDueDate({ joinDate, investments, now = new Date() }) {
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  const sorted = [...(investments || [])].sort(
    (a, b) => parseDateOnly(b.date).getTime() - parseDateOnly(a.date).getTime()
  );
  const last = sorted[0];
  const anchor = last ? parseDateOnly(last.date) : parseDateOnly(joinDate);
  anchor.setHours(0, 0, 0, 0);

  let due = addOneMonth(anchor);
  while (due.getTime() < today.getTime()) {
    due = addOneMonth(due);
  }
  return due;
}

export function getSuggestedAmount(investments) {
  const sorted = [...(investments || [])].sort(
    (a, b) => parseDateOnly(b.date).getTime() - parseDateOnly(a.date).getTime()
  );
  if (sorted[0]?.amount) return Number(sorted[0].amount);
  return DEFAULT_AMOUNT;
}

export function daysUntilDue(due, now = new Date()) {
  const a = new Date(now);
  a.setHours(0, 0, 0, 0);
  const b = new Date(due);
  b.setHours(0, 0, 0, 0);
  return Math.ceil((b.getTime() - a.getTime()) / MS_DAY);
}

export function isInPaymentReminderWindow(due, now = new Date()) {
  const days = daysUntilDue(due, now);
  return days >= 0 && days <= REMINDER_DAYS_BEFORE;
}

export function ymd(d) {
  return d.toISOString().slice(0, 10);
}

/** 6-hour slot key so we send at most once per slot */
export function currentSlotKey(now = new Date()) {
  const h = Math.floor(now.getUTCHours() / 6) * 6;
  return `${ymd(now)}T${String(h).padStart(2, '0')}`;
}

export { REMINDER_DAYS_BEFORE, DEFAULT_AMOUNT };
