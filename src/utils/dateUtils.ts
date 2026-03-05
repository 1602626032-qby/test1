import dayjs from 'dayjs';

export function formatRemaining(dueISO?: string): string | null {
  if (!dueISO) return null;
  const due = dayjs(dueISO);
  if (!due.isValid()) return null;
  const now = dayjs();

  const startOfToday = now.startOf('day');
  const startOfDue = due.startOf('day');
  const diffDays = startOfDue.diff(startOfToday, 'day');

  if (diffDays > 0) return `剩余${diffDays}天`;
  if (diffDays === 0) return '今天到期';
  return `已逾期${Math.abs(diffDays)}天`;
}

export function isSameDayISO(aISO: string, bISO: string): boolean {
  return dayjs(aISO).isSame(dayjs(bISO), 'day');
}

