import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Settings } from '@/types/settings';
import { STORAGE_KEYS } from '@/utils/constants';

type SettingsState = Settings & {
  setNickname: (nickname: string) => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      nickname: '用户',
      setNickname: (nickname) => set({ nickname }),
    }),
    {
      name: STORAGE_KEYS.settings,
      version: 1,
    },
  ),
);

