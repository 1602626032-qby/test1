import { DatePicker, Form, Input, Modal, Select, message } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import type { CalendarEvent, EventColor } from '@/types/calendar';
import { useCalendarStore } from '@/stores/calendarStore';
import { EVENT_COLOR_MAP } from '@/utils/constants';

type Values = {
  title: string;
  start: Dayjs;
  end: Dayjs;
  color: EventColor;
  location?: string;
  notes?: string;
};

export function EventModal({
  open,
  onClose,
  day,
  initial,
  draft,
}: {
  open: boolean;
  onClose: () => void;
  day: Dayjs;
  initial: CalendarEvent | null;
  draft?: { start: Dayjs; end: Dayjs } | null;
}) {
  const add = useCalendarStore((s) => s.addEvent);
  const update = useCalendarStore((s) => s.updateEvent);
  const [form] = Form.useForm<Values>();

  useEffect(() => {
    if (!open) return;
    if (initial) {
      form.setFieldsValue({
        title: initial.title,
        start: dayjs(initial.start),
        end: dayjs(initial.end),
        color: initial.color,
        location: initial.location,
        notes: initial.notes,
      });
    } else {
      const start = draft?.start ?? day.hour(10).minute(0);
      const end = draft?.end ?? day.hour(10).minute(30);
      form.setFieldsValue({
        title: '',
        start,
        end,
        color: 'work',
        location: '',
        notes: '',
      });
    }
  }, [day, draft, form, initial, open]);

  const colorOptions = (Object.keys(EVENT_COLOR_MAP) as EventColor[]).map((k) => ({
    value: k,
    label: EVENT_COLOR_MAP[k].label,
  }));

  return (
    <Modal
      open={open}
      title={initial ? '编辑事件' : '新建事件'}
      okText={initial ? '保存' : '创建'}
      cancelText="取消"
      onCancel={onClose}
      onOk={async () => {
        const v = await form.validateFields();
        if (!v.end.isAfter(v.start)) {
          message.error('结束时间必须晚于开始时间');
          return;
        }
        if (initial) {
          update(initial.id, {
            title: v.title.trim(),
            start: v.start.toISOString(),
            end: v.end.toISOString(),
            color: v.color,
            location: v.location?.trim() || '',
            notes: v.notes?.trim() || '',
          });
        } else {
          add({
            title: v.title.trim(),
            start: v.start.toISOString(),
            end: v.end.toISOString(),
            color: v.color,
            location: v.location?.trim() || '',
            notes: v.notes?.trim() || '',
          });
        }
        onClose();
      }}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="title" label="标题" rules={[{ required: true, message: '请输入标题' }]}>
          <Input maxLength={80} />
        </Form.Item>
        <Form.Item name="color" label="分类颜色" rules={[{ required: true }]}>
          <Select options={colorOptions} />
        </Form.Item>
        <Form.Item name="start" label="开始时间" rules={[{ required: true }]}>
          <DatePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="end" label="结束时间" rules={[{ required: true }]}>
          <DatePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="location" label="地点（可选）">
          <Input maxLength={80} />
        </Form.Item>
        <Form.Item name="notes" label="备注（可选）">
          <Input.TextArea autoSize={{ minRows: 2, maxRows: 6 }} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

