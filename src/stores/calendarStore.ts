import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CalendarEvent, EventColor } from '@/types/calendar';
import { STORAGE_KEYS } from '@/utils/constants';
import { newId } from '@/utils/id';
import { sampleEvents } from '@/utils/sampleData';

type CalendarState = {
  events: CalendarEvent[];
  addEvent: (input: {
    title: string;
    start: string;
    end: string;
    color: EventColor;
    location?: string;
    notes?: string;
  }) => void;
  updateEvent: (id: string, updates: Partial<Omit<CalendarEvent, 'id'>>) => void;
  deleteEvent: (id: string) => void;
  eventsForDayISO: (dayISO: string) => CalendarEvent[];
};

function ensureSeed(existing: CalendarEvent[] | undefined): CalendarEvent[] {
  if (Array.isArray(existing) && existing.length > 0) return existing;
  return sampleEvents();
}

export const useCalendarStore = create<CalendarState>()(
  persist(
    (set, get) => ({
      events: ensureSeed(undefined),
      addEvent: (input) => {
        const e: CalendarEvent = {
          id: newId(),
          title: input.title.trim(),
          start: input.start,
          end: input.end,
          color: input.color,
          location: input.location?.trim() || '',
          notes: input.notes?.trim() || '',
        };
        set({ events: [e, ...get().events] });
      },
      updateEvent: (id, updates) =>
        set({
          events: get().events.map((e) => (e.id === id ? { ...e, ...updates } : e)),
        }),
      deleteEvent: (id) => set({ events: get().events.filter((e) => e.id !== id) }),
      eventsForDayISO: (dayISO) => {
        const day = new Date(dayISO);
        const start = new Date(day);
        start.setHours(0, 0, 0, 0);
        const end = new Date(day);
        end.setHours(23, 59, 59, 999);
        const startMs = start.getTime();
        const endMs = end.getTime();
        return get()
          .events.filter((e) => {
            const ms = new Date(e.start).getTime();
            return ms >= startMs && ms <= endMs;
          })
          .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
      },
    }),
    {
      name: STORAGE_KEYS.calendar,
      version: 1,
      merge: (persisted, current) => {
        const persistedState = persisted as Partial<CalendarState> | undefined;
        return {
          ...current,
          ...persistedState,
          events: ensureSeed(persistedState?.events),
        };
      },
    },
  ),
);

