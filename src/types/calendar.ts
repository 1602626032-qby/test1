export type EventColor = 'work' | 'personal' | 'learning' | 'health' | 'meeting' | 'other';

export type CalendarEvent = {
  id: string;
  title: string;
  start: string; // ISO
  end: string; // ISO
  color: EventColor;
  location?: string;
  notes?: string;
};

