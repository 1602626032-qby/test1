import { Button, Checkbox, Input, Modal, Space, Typography } from 'antd';
import { useState } from 'react';
import type { Todo } from '@/types/todo';
import { useTodoStore } from '@/stores/todoStore';

export function SubtaskList({ todo }: { todo: Todo }) {
  const add = useTodoStore((s) => s.addSubtask);
  const update = useTodoStore((s) => s.updateSubtask);
  const del = useTodoStore((s) => s.deleteSubtask);

  const [expanded, setExpanded] = useState(false);
  const [title, setTitle] = useState('');

  const hasSub = todo.subtasks.length > 0;

  return (
    <div>
      <Space size={8}>
        <Button size="small" type="link" style={{ padding: 0 }} onClick={() => setExpanded((v) => !v)}>
          {expanded ? '收起子任务' : '展开子任务'}
        </Button>
        {hasSub ? (
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            {todo.subtasks.filter((s) => !s.completed).length}/{todo.subtasks.length}
          </Typography.Text>
        ) : null}
      </Space>

      {expanded ? (
        <div style={{ marginTop: 8, paddingLeft: 18 }}>
          <Space.Compact style={{ width: '100%', marginBottom: 8 }}>
            <Input
              value={title}
              placeholder="添加子任务..."
              onChange={(e) => setTitle(e.target.value)}
              onPressEnter={() => {
                const v = title.trim();
                if (!v) return;
                add(todo.id, v);
                setTitle('');
              }}
            />
            <Button
              type="primary"
              onClick={() => {
                const v = title.trim();
                if (!v) return;
                add(todo.id, v);
                setTitle('');
              }}
            >
              添加
            </Button>
          </Space.Compact>

          <Space direction="vertical" size={6} style={{ width: '100%' }}>
            {todo.subtasks.map((s) => (
              <div key={s.id} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <Checkbox
                  checked={s.completed}
                  onChange={() => update(todo.id, s.id, { completed: !s.completed })}
                />
                <Typography.Text
                  style={{
                    flex: 1,
                    textDecoration: s.completed ? 'line-through' : 'none',
                    color: s.completed ? '#94A3B8' : undefined,
                  }}
                >
                  {s.title}
                </Typography.Text>
                <Button
                  size="small"
                  danger
                  onClick={() => {
                    Modal.confirm({
                      title: '删除子任务？',
                      okText: '删除',
                      cancelText: '取消',
                      okButtonProps: { danger: true },
                      onOk: () => del(todo.id, s.id),
                    });
                  }}
                >
                  删除
                </Button>
              </div>
            ))}
          </Space>
        </div>
      ) : null}
    </div>
  );
}

