import { Badge, Card, Switch } from 'antd';
import { useMemo } from 'react';
import { useTodoStore } from '@/stores/todoStore';
import { TodoList } from './TodoList';

export function TodoPanel() {
  const todos = useTodoStore((s) => s.todos);
  const showCompleted = useTodoStore((s) => s.showCompleted);
  const setShowCompleted = useTodoStore((s) => s.setShowCompleted);

  const openCount = useMemo(() => todos.filter((t) => !t.completed).length, [todos]);

  return (
    <Card
      title={
        <span>
          待办事项 <Badge count={openCount} showZero style={{ backgroundColor: '#3B82F6' }} />
        </span>
      }
      extra={
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: '#64748B', fontSize: 12 }}>显示已完成</span>
          <Switch size="small" checked={showCompleted} onChange={setShowCompleted} />
        </span>
      }
      styles={{ body: { paddingTop: 8 } }}
    >
      <TodoList />
    </Card>
  );
}

