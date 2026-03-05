import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Priority, Subtask, Todo } from '@/types/todo';
import { STORAGE_KEYS } from '@/utils/constants';
import { newId } from '@/utils/id';
import { sampleTodos } from '@/utils/sampleData';

type TodoState = {
  todos: Todo[];
  showCompleted: boolean;
  setShowCompleted: (v: boolean) => void;
  addTodo: (input: { title: string; priority: Priority; dueDate?: string; notes?: string }) => void;
  updateTodo: (id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt' | 'subtasks'>> & { subtasks?: Subtask[] }) => void;
  deleteTodo: (id: string) => void;
  toggleTodoCompleted: (id: string) => void;
  addSubtask: (todoId: string, title: string) => void;
  updateSubtask: (todoId: string, subtaskId: string, updates: Partial<Omit<Subtask, 'id'>>) => void;
  deleteSubtask: (todoId: string, subtaskId: string) => void;
};

function ensureSeed(existing: Todo[] | undefined): Todo[] {
  if (Array.isArray(existing) && existing.length > 0) return existing;
  return sampleTodos();
}

export const useTodoStore = create<TodoState>()(
  persist(
    (set, get) => ({
      todos: ensureSeed(undefined),
      showCompleted: false,
      setShowCompleted: (v) => set({ showCompleted: v }),
      addTodo: (input) => {
        const nowISO = new Date().toISOString();
        const todo: Todo = {
          id: newId(),
          title: input.title.trim(),
          priority: input.priority,
          dueDate: input.dueDate,
          notes: input.notes?.trim() || '',
          completed: false,
          createdAt: nowISO,
          subtasks: [],
        };
        set({ todos: [todo, ...get().todos] });
      },
      updateTodo: (id, updates) =>
        set({
          todos: get().todos.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        }),
      deleteTodo: (id) => set({ todos: get().todos.filter((t) => t.id !== id) }),
      toggleTodoCompleted: (id) =>
        set({
          todos: get().todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
        }),
      addSubtask: (todoId, title) =>
        set({
          todos: get().todos.map((t) => {
            if (t.id !== todoId) return t;
            const sub: Subtask = { id: newId(), title: title.trim(), completed: false };
            return { ...t, subtasks: [...t.subtasks, sub] };
          }),
        }),
      updateSubtask: (todoId, subtaskId, updates) =>
        set({
          todos: get().todos.map((t) => {
            if (t.id !== todoId) return t;
            return {
              ...t,
              subtasks: t.subtasks.map((s) => (s.id === subtaskId ? { ...s, ...updates } : s)),
            };
          }),
        }),
      deleteSubtask: (todoId, subtaskId) =>
        set({
          todos: get().todos.map((t) => {
            if (t.id !== todoId) return t;
            return { ...t, subtasks: t.subtasks.filter((s) => s.id !== subtaskId) };
          }),
        }),
    }),
    {
      name: STORAGE_KEYS.todo,
      version: 1,
      merge: (persisted, current) => {
        const persistedState = persisted as Partial<TodoState> | undefined;
        return {
          ...current,
          ...persistedState,
          todos: ensureSeed(persistedState?.todos),
        };
      },
    },
  ),
);

