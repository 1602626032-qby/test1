import type { EventColor } from '@/types/calendar';
import type { Priority } from '@/types/todo';

export const STORAGE_KEYS = {
  todo: 'todo-storage',
  calendar: 'calendar-storage',
  tools: 'tools-storage',
  settings: 'settings-storage',
} as const;

export const EVENT_COLOR_MAP: Record<EventColor, { label: string; hex: string }> = {
  work: { label: '工作', hex: '#3B82F6' },
  personal: { label: '个人', hex: '#10B981' },
  learning: { label: '学习', hex: '#8B5CF6' },
  health: { label: '健康', hex: '#F97316' },
  meeting: { label: '会议', hex: '#EC4899' },
  other: { label: '其他', hex: '#64748B' },
};

export const PRIORITY_META: Record<Priority, { label: string; hex: string }> = {
  high: { label: '高', hex: '#EF4444' },
  medium: { label: '中', hex: '#F97316' },
  low: { label: '低', hex: '#3B82F6' },
};

export const BACKUP_VERSION = 1;

