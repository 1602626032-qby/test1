import type { CalendarEvent } from '@/types/calendar';
import type { Settings } from '@/types/settings';
import type { Todo } from '@/types/todo';
import type { Tool } from '@/types/tool';
import { BACKUP_VERSION } from './constants';

export type BackupPayloadV1 = {
  version: number;
  exportedAt: string;
  todos: Todo[];
  events: CalendarEvent[];
  tools: Tool[];
  settings?: Settings;
};

export type BackupValidationResult =
  | { ok: true; payload: BackupPayloadV1 }
  | { ok: false; error: string };

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}

function isString(v: unknown): v is string {
  return typeof v === 'string';
}

function isBoolean(v: unknown): v is boolean {
  return typeof v === 'boolean';
}

function isArray(v: unknown): v is unknown[] {
  return Array.isArray(v);
}

function validateTodo(v: unknown): v is Todo {
  if (!isObject(v)) return false;
  if (!isString(v.id) || !isString(v.title) || !isString(v.priority) || !isBoolean(v.completed)) return false;
  if (!isString(v.createdAt)) return false;
  if (v.dueDate !== undefined && !isString(v.dueDate)) return false;
  if (v.notes !== undefined && !isString(v.notes)) return false;
  if (!isArray(v.subtasks)) return false;
  for (const s of v.subtasks) {
    if (!isObject(s)) return false;
    if (!isString(s.id) || !isString(s.title) || !isBoolean(s.completed)) return false;
  }
  return true;
}

function validateEvent(v: unknown): v is CalendarEvent {
  if (!isObject(v)) return false;
  if (!isString(v.id) || !isString(v.title) || !isString(v.start) || !isString(v.end) || !isString(v.color)) return false;
  if (v.location !== undefined && !isString(v.location)) return false;
  if (v.notes !== undefined && !isString(v.notes)) return false;
  return true;
}

function validateTool(v: unknown): v is Tool {
  if (!isObject(v)) return false;
  return isString(v.id) && isString(v.name) && isString(v.url) && isString(v.icon);
}

function validateSettings(v: unknown): v is Settings {
  if (!isObject(v)) return false;
  return isString(v.nickname);
}

export function buildBackupPayload(input: {
  todos: Todo[];
  events: CalendarEvent[];
  tools: Tool[];
  settings?: Settings;
}): BackupPayloadV1 {
  return {
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    todos: input.todos,
    events: input.events,
    tools: input.tools,
    settings: input.settings,
  };
}

export function downloadBackup(payload: BackupPayloadV1, filename: string) {
  const json = JSON.stringify(payload, null, 2);
  const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export async function readFileAsText(file: File): Promise<string> {
  return await file.text();
}

export function validateBackupJson(text: string): BackupValidationResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, error: '文件不是有效的 JSON。' };
  }

  if (!isObject(parsed)) return { ok: false, error: '备份格式不正确（根对象不是 JSON 对象）。' };

  const version = parsed.version;
  if (typeof version !== 'number') return { ok: false, error: '备份格式不正确（缺少 version）。' };
  if (version !== BACKUP_VERSION) return { ok: false, error: `暂不支持该备份版本（version=${String(version)}）。` };

  if (!isString(parsed.exportedAt)) return { ok: false, error: '备份格式不正确（缺少 exportedAt）。' };
  if (!isArray(parsed.todos) || !isArray(parsed.events) || !isArray(parsed.tools)) {
    return { ok: false, error: '备份格式不正确（缺少 todos/events/tools 数组）。' };
  }

  const todos = parsed.todos;
  const events = parsed.events;
  const tools = parsed.tools;
  for (const t of todos) if (!validateTodo(t)) return { ok: false, error: '备份格式不正确（todos 数据结构不符合预期）。' };
  for (const e of events) if (!validateEvent(e)) return { ok: false, error: '备份格式不正确（events 数据结构不符合预期）。' };
  for (const tool of tools) if (!validateTool(tool)) return { ok: false, error: '备份格式不正确（tools 数据结构不符合预期）。' };

  const settingsRaw = parsed.settings;
  const settings = settingsRaw === undefined ? undefined : validateSettings(settingsRaw) ? settingsRaw : null;
  if (settings === null) return { ok: false, error: '备份格式不正确（settings 数据结构不符合预期）。' };

  return {
    ok: true,
    payload: {
      version,
      exportedAt: parsed.exportedAt,
      todos: todos as Todo[],
      events: events as CalendarEvent[],
      tools: tools as Tool[],
      settings: settings ?? undefined,
    },
  };
}

