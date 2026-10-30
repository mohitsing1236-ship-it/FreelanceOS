export function formatPrice(amount: number, currency: string, locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  }).format(amount);
}

/** "19:30" -> "7:30 pm" */
export function formatSlot(slot: string): string {
  const [hours, minutes] = slot.split(':').map(Number);
  const period = hours >= 12 ? 'pm' : 'am';
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return minutes === 0
    ? `${hour12} ${period}`
    : `${hour12}:${String(minutes).padStart(2, '0')} ${period}`;
}

/** Local "YYYY-MM-DD" for today, suitable for <input type="date" min>. */
export function todayISO(): string {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}

/** Parse "YYYY-MM-DD" as a local date (noon avoids daylight-saving edge cases). */
export function parseLocalDate(value: string): Date {
  return new Date(`${value}T12:00:00`);
}
