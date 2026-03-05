import { Calendar, Tag } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { useCalendarStore } from '@/stores/calendarStore';
import { EVENT_COLOR_MAP } from '@/utils/constants';
import { DayViewModal } from './DayViewModal';

type CellEvent = { id: string; title: string; colorHex: string };

export function MonthView() {
  const events = useCalendarStore((s) => s.events);
  const [selected, setSelected] = useState<Dayjs>(() => dayjs());
  const [open, setOpen] = useState(false);

  const byDay = useMemo(() => {
    const m = new Map<string, CellEvent[]>();
    for (const e of events) {
      const key = dayjs(e.start).format('YYYY-MM-DD');
      const list = m.get(key) ?? [];
      list.push({ id: e.id, title: e.title, colorHex: EVENT_COLOR_MAP[e.color].hex });
      m.set(key, list);
    }
    for (const [k, list] of m) {
      list.sort((a, b) => a.title.localeCompare(b.title));
      m.set(k, list);
    }
    return m;
  }, [events]);

  return (
    <div>
      <Calendar
        fullscreen={false}
        cellRender={(date) => {
          const key = date.format('YYYY-MM-DD');
          const list = byDay.get(key) ?? [];
          const shown = list.slice(0, 2);
          const rest = list.length - shown.length;
          if (list.length === 0) return null;
          return (
            <div style={{ marginTop: 4 }}>
              {shown.map((e) => (
                <div key={e.id} style={{ fontSize: 12, lineHeight: '16px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  <span style={{ color: e.colorHex, marginRight: 6 }}>●</span>
                  {e.title}
                </div>
              ))}
              {rest > 0 ? (
                <Tag style={{ marginTop: 4 }} bordered={false}>
                  ...
                </Tag>
              ) : null}
            </div>
          );
        }}
        onSelect={(d) => {
          setSelected(d);
          setOpen(true);
        }}
      />

      <DayViewModal
        open={open}
        date={selected}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}

