import { Button, Modal, Space, Typography } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import type { CalendarEvent } from '@/types/calendar';
import { useCalendarStore } from '@/stores/calendarStore';
import { EVENT_COLOR_MAP } from '@/utils/constants';
import { EventModal } from './EventModal';
import styles from './dayView.module.css';

export function DayViewModal({
  open,
  date,
  onClose,
}: {
  open: boolean;
  date: Dayjs;
  onClose: () => void;
}) {
  const eventsForDayISO = useCalendarStore((s) => s.eventsForDayISO);
  const del = useCalendarStore((s) => s.deleteEvent);

  const [eventOpen, setEventOpen] = useState(false);
  const [editing, setEditing] = useState<CalendarEvent | null>(null);
  const [draft, setDraft] = useState<{ start: Dayjs; end: Dayjs } | null>(null);

  const dayISO = useMemo(() => date.startOf('day').toISOString(), [date]);
  const events = useMemo(() => eventsForDayISO(dayISO), [eventsForDayISO, dayISO]);

  const startHour = 8;
  const endHour = 22;
  const slotMinutes = 30;
  const slotHeight = 36;
  const totalMinutes = (endHour - startHour) * 60;
  const totalHeight = (totalMinutes / slotMinutes) * slotHeight;

  const positioned = useMemo(() => {
    return events
      .map((e) => {
        const start = dayjs(e.start);
        const end = dayjs(e.end);
        const dayStart = date.startOf('day').hour(startHour).minute(0);
        const clampStart = start.isBefore(dayStart) ? dayStart : start;
        const dayEnd = date.startOf('day').hour(endHour).minute(0);
        const clampEnd = end.isAfter(dayEnd) ? dayEnd : end;

        const startMin = Math.max(0, clampStart.diff(dayStart, 'minute'));
        const endMin = Math.max(startMin + 1, clampEnd.diff(dayStart, 'minute'));
        const top = (startMin / slotMinutes) * slotHeight;
        const height = Math.max(slotHeight, ((endMin - startMin) / slotMinutes) * slotHeight);
        return { e, top, height };
      })
      .sort((a, b) => a.top - b.top);
  }, [date, events]);

  return (
    <Modal
      open={open}
      title={`${date.format('YYYY年M月D日')} 日程`}
      onCancel={onClose}
      footer={
        <Space>
          <Button onClick={onClose}>关闭</Button>
          <Button
            type="primary"
            onClick={() => {
              setEditing(null);
              setDraft(null);
              setEventOpen(true);
            }}
          >
            + 新建事件
          </Button>
        </Space>
      }
      width={640}
    >
      <Typography.Text type="secondary">
        点击空白时间可快速新建事件；事件块可编辑/删除。
      </Typography.Text>

      <div className={styles.container}>
        <div>
          {Array.from({ length: endHour - startHour + 1 }).map((_, idx) => {
            const h = startHour + idx;
            return (
              <div key={h} className={styles.timeLabel}>
                {String(h).padStart(2, '0')}:00
              </div>
            );
          })}
        </div>

        <div className={styles.timeline} style={{ height: totalHeight }}>
          {Array.from({ length: totalMinutes / slotMinutes }).map((_, idx) => (
            <div
              key={idx}
              className={styles.slot}
              onClick={() => {
                const start = date.startOf('day').hour(startHour).minute(0).add(idx * slotMinutes, 'minute');
                const end = start.add(slotMinutes, 'minute');
                setEditing(null);
                setDraft({ start, end });
                setEventOpen(true);
              }}
            />
          ))}

          {positioned.map(({ e, top, height }) => {
            const color = EVENT_COLOR_MAP[e.color];
            return (
              <div
                key={e.id}
                className={styles.event}
                style={{
                  top,
                  height,
                  background: `${color.hex}1F`,
                  borderColor: `${color.hex}55`,
                }}
                onClick={() => {
                  setEditing(e);
                  setDraft(null);
                  setEventOpen(true);
                }}
              >
                <div className={styles.eventTitle}>
                  <span style={{ color: color.hex, marginRight: 6 }}>●</span>
                  {e.title}
                </div>
                <div className={styles.eventMeta}>
                  {dayjs(e.start).format('HH:mm')} - {dayjs(e.end).format('HH:mm')}
                  {e.location ? ` · ${e.location}` : ''}
                </div>
                <div style={{ marginTop: 6, display: 'flex', gap: 8 }}>
                  <Button
                    size="small"
                    onClick={(ev) => {
                      ev.stopPropagation();
                      setEditing(e);
                      setDraft(null);
                      setEventOpen(true);
                    }}
                  >
                    编辑
                  </Button>
                  <Button
                    size="small"
                    danger
                    onClick={(ev) => {
                      ev.stopPropagation();
                      Modal.confirm({
                        title: '确认删除事件？',
                        okText: '删除',
                        cancelText: '取消',
                        okButtonProps: { danger: true },
                        onOk: () => del(e.id),
                      });
                    }}
                  >
                    删除
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <EventModal
        open={eventOpen}
        onClose={() => setEventOpen(false)}
        day={date}
        initial={editing && editing.id ? editing : null}
        draft={draft}
      />
    </Modal>
  );
}

