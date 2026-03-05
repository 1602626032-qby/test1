import { Button, DatePicker, Empty, Form, Input, Modal, Select, Space, Typography } from 'antd';
import type { Dayjs } from 'dayjs';
import { useMemo, useState } from 'react';
import type { Priority, Todo } from '@/types/todo';
import { PRIORITY_META } from '@/utils/constants';
import { useTodoStore } from '@/stores/todoStore';
import { TodoItem } from './TodoItem';

type AddValues = {
  title: string;
  priority: Priority;
  dueDate?: Dayjs;
  notes?: string;
};

const priorityOptions = (Object.keys(PRIORITY_META) as Priority[]).map((p) => ({
  value: p,
  label: PRIORITY_META[p].label,
}));

export function TodoList() {
  const todos = useTodoStore((s) => s.todos);
  const showCompleted = useTodoStore((s) => s.showCompleted);
  const addTodo = useTodoStore((s) => s.addTodo);

  const [open, setOpen] = useState(false);
  const [form] = Form.useForm<AddValues>();

  const filtered = useMemo(() => {
    if (showCompleted) return todos;
    return todos.filter((t) => !t.completed);
  }, [showCompleted, todos]);

  const grouped = useMemo(() => {
    const openTodos: Todo[] = [];
    const doneTodos: Todo[] = [];
    for (const t of filtered) (t.completed ? doneTodos : openTodos).push(t);
    return { openTodos, doneTodos };
  }, [filtered]);

  const empty = grouped.openTodos.length === 0 && grouped.doneTodos.length === 0;

  return (
    <div>
      <Space style={{ marginBottom: 12 }}>
        <Button type="primary" onClick={() => setOpen(true)}>
          + 添加待办
        </Button>
      </Space>

      {empty ? (
        <Empty description="暂无待办" />
      ) : (
        <Space direction="vertical" size={8} style={{ width: '100%' }}>
          {grouped.openTodos.map((t) => (
            <TodoItem key={t.id} todo={t} />
          ))}
          {grouped.doneTodos.length > 0 ? (
            <div style={{ marginTop: 8 }}>
              <Typography.Text type="secondary">已完成</Typography.Text>
              <div style={{ marginTop: 8 }}>
                <Space direction="vertical" size={8} style={{ width: '100%' }}>
                  {grouped.doneTodos.map((t) => (
                    <TodoItem key={t.id} todo={t} />
                  ))}
                </Space>
              </div>
            </div>
          ) : null}
        </Space>
      )}

      <Modal
        open={open}
        title="添加待办"
        okText="添加"
        cancelText="取消"
        onCancel={() => setOpen(false)}
        onOk={async () => {
          const values = await form.validateFields();
          addTodo({
            title: values.title,
            priority: values.priority,
            dueDate: values.dueDate ? values.dueDate.toISOString() : undefined,
            notes: values.notes,
          });
          setOpen(false);
          form.resetFields();
        }}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            priority: 'medium' as Priority,
          }}
        >
          <Form.Item name="title" label="标题" rules={[{ required: true, message: '请输入标题' }]}>
            <Input placeholder="写一个待办..." maxLength={80} />
          </Form.Item>
          <Form.Item name="priority" label="优先级" rules={[{ required: true }]}>
            <Select options={priorityOptions} />
          </Form.Item>
          <Form.Item name="dueDate" label="截止时间（可选）">
            <DatePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="notes" label="备注（可选）">
            <Input.TextArea placeholder="备注..." autoSize={{ minRows: 2, maxRows: 6 }} />
          </Form.Item>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            提示：截止时间会存为 ISO 字符串。
          </Typography.Text>
        </Form>
      </Modal>
    </div>
  );
}

