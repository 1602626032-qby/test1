import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Tool } from '@/types/tool';
import { STORAGE_KEYS } from '@/utils/constants';
import { newId } from '@/utils/id';
import { sampleTools } from '@/utils/sampleData';

type ToolsState = {
  tools: Tool[];
  addTool: (input: { name: string; url: string; icon?: string }) => void;
  updateTool: (id: string, updates: Partial<Omit<Tool, 'id'>>) => void;
  deleteTool: (id: string) => void;
};

function ensureSeed(existing: Tool[] | undefined): Tool[] {
  if (Array.isArray(existing) && existing.length > 0) return existing;
  return sampleTools();
}

export function normalizeUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return trimmed;
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  return `https://${trimmed}`;
}

export function isValidHttpUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

export const useToolsStore = create<ToolsState>()(
  persist(
    (set, get) => ({
      tools: ensureSeed(undefined),
      addTool: (input) => {
        const tool: Tool = {
          id: newId(),
          name: input.name.trim(),
          url: normalizeUrl(input.url),
          icon: (input.icon || '🔗').trim() || '🔗',
        };
        set({ tools: [...get().tools, tool] });
      },
      updateTool: (id, updates) =>
        set({
          tools: get().tools.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        }),
      deleteTool: (id) => set({ tools: get().tools.filter((t) => t.id !== id) }),
    }),
    {
      name: STORAGE_KEYS.tools,
      version: 1,
      merge: (persisted, current) => {
        const persistedState = persisted as Partial<ToolsState> | undefined;
        return {
          ...current,
          ...persistedState,
          tools: ensureSeed(persistedState?.tools),
        };
      },
    },
  ),
);

