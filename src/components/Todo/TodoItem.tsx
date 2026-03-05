import { Button, Checkbox, DatePicker, Form, Input, Modal, Select, Space, Tag, Typography } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useMemo, useState } from 'react';
import type { Priority, Todo } from '@/types/todo';
import { PRIORITY_META } from '@/utils/constants';
import { formatRemaining } from '@/utils/dateUtils';
import { useTodoStore } from '@/stores/todoStore';
import { SubtaskList } from './SubtaskList';

type EditValues = {
  title: string;
  priority: Priority;
  dueDate?: Dayjs;
  notes?: string;
};

export function TodoItem({ todo }: { todo: Todo }) {
  const toggle = useTodoStore((s) => s.toggleTodoCompleted);
  const del = useTodoStore((s) => s.deleteTodo);
  const update = useTodoStore((s) => s.updateTodo);

  const [editOpen, setEditOpen] = useState(false);
  const [form] = Form.useForm<EditValues>();

  const remaining = useMemo(() => formatRemaining(todo.dueDate), [todo.dueDate]);

  const priorityMeta = PRIORITY_META[todo.priority];
  const priorityOptions = (Object.keys(PRIORITY_META) as Priority[]).map((p) => ({
    value: p,
    label: PRIORITY_META[p].label,
  }));

  return (
    <div
      style={{
        border: '1px solid #E2E8F0',
        borderRadius: 12,
        padding: 12,
        background: '#fff',
      }}
    >
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <Checkbox checked={todo.completed} onChange={() => toggle(todo.id)} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
            <div style={{ minWidth: 0 }}>
              <Typography.Text
                strong
                style={{
                  textDecoration: todo.completed ? 'line-through' : 'none',
                  color: todo.completed ? '#94A3B8' : '#1E293B',
                }}
              >
                {todo.title}
              </Typography.Text>
              <div style={{ marginTop: 6, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <Tag color={priorityMeta.hex} style={{ borderRadius: 16 }}>
                  {priorityMeta.label}
                </Tag>
                {remaining ? <Tag style={{ borderRadius: 16 }}>{remaining}</Tag> : null}
              </div>
              {todo.notes ? (
                <div style={{ marginTop: 8, color: '#64748B', whiteSpace: 'pre-wrap' }}>
                  {todo.notes}
                </div>
              ) : null}
            </div>
            <Space size={8}>
              <Button
                size="small"
                onClick={() => {
                  form.setFieldsValue({
                    title: todo.title,
                    priority: todo.priority,
                    dueDate: todo.dueDate ? dayjs(todo.dueDate) : undefined,
                    notes: todo.notes,
                  });
                  setEditOpen(true);
                }}
              >
                编辑
              </Button>
              <Button
                size="small"
                danger
                onClick={() => {
                  Modal.confirm({
                    title: '确认删除？',
                    content: '删除后无法恢复。',
                    okText: '删除',
                    cancelText: '取消',
                    okButtonProps: { danger: true },
                    onOk: () => del(todo.id),
                  });
                }}
              >
                删除
              </Button>
            </Space>
          </div>

          <div style={{ marginTop: 10 }}>
            <SubtaskList todo={todo} />
          </div>
        </div>
      </div>

      <Modal
        open={editOpen}
        title="编辑待办"
        okText="保存"
        cancelText="取消"
        onCancel={() => setEditOpen(false)}
        onOk={async () => {
          const values = await form.validateFields();
          update(todo.id, {
            title: values.title.trim(),
            priority: values.priority,
            dueDate: values.dueDate ? values.dueDate.toISOString() : undefined,
            notes: values.notes?.trim() || '',
          });
          setEditOpen(false);
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="标题" rules={[{ required: true, message: '请输入标题' }]}>
            <Input maxLength={80} />
          </Form.Item>
          <Form.Item name="priority" label="优先级" rules={[{ required: true }]}>
            <Select options={priorityOptions} />
          </Form.Item>
          <Form.Item name="dueDate" label="截止时间（可选）">
            <DatePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="notes" label="备注（可选）">
            <Input.TextArea autoSize={{ minRows: 2, maxRows: 6 }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

