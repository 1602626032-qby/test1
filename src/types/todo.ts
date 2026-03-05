export type Priority = 'high' | 'medium' | 'low';

export type Subtask = {
  id: string;
  title: string;
  completed: boolean;
};

export type Todo = {
  id: string;
  title: string;
  priority: Priority;
  dueDate?: string; // ISO
  notes?: string;
  completed: boolean;
  createdAt: string; // ISO
  subtasks: Subtask[];
};

