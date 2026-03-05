import dayjs from 'dayjs';
import type { CalendarEvent } from '@/types/calendar';
import type { Todo } from '@/types/todo';
import type { Tool } from '@/types/tool';
import { newId } from './id';

export function sampleTodos(): Todo[] {
  const now = dayjs();
  return [
    {
      id: newId(),
      title: '完成个人工作台 V1',
      priority: 'high',
      dueDate: now.add(2, 'day').hour(18).minute(0).second(0).millisecond(0).toISOString(),
      notes: '按 PRDS 文档逐项实现并验收',
      completed: false,
      createdAt: now.toISOString(),
      subtasks: [
        { id: newId(), title: '实现本地备份导入/导出', completed: false },
        { id: newId(), title: '完成待办/日历/工具三个模块', completed: false },
      ],
    },
    {
      id: newId(),
      title: '预约体检',
      priority: 'medium',
      dueDate: now.add(5, 'day').startOf('day').toISOString(),
      notes: '',
      completed: false,
      createdAt: now.toISOString(),
      subtasks: [],
    },
    {
      id: newId(),
      title: '取快递',
      priority: 'low',
      dueDate: undefined,
      notes: '',
      completed: true,
      createdAt: now.toISOString(),
      subtasks: [],
    },
  ];
}

export function sampleEvents(): CalendarEvent[] {
  const today = dayjs().startOf('day');
  return [
    {
      id: newId(),
      title: '晨会',
      start: today.hour(10).minute(0).toISOString(),
      end: today.hour(10).minute(30).toISOString(),
      color: 'meeting',
      location: '',
      notes: '',
    },
    {
      id: newId(),
      title: '写周报',
      start: today.hour(14).minute(0).toISOString(),
      end: today.hour(15).minute(0).toISOString(),
      color: 'work',
      location: '',
      notes: '',
    },
  ];
}

export function sampleTools(): Tool[] {
  return [
    { id: newId(), name: 'Notion', url: 'https://notion.so', icon: '📁' },
    { id: newId(), name: 'Gmail', url: 'https://mail.google.com', icon: '✉️' },
    { id: newId(), name: 'GitHub', url: 'https://github.com', icon: '💻' },
  ];
}

